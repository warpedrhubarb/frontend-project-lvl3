import * as yup from 'yup';
import callAPI from '../utils/api';
import yupLocale from '../locales/yup.js';

const validate = (link, schema) => {
  try {
    schema.validateSync(link);
    return null;
  } catch (e) {
    return e;
  }
};

const updateValidationState = (watchedState, baseLinkSchema) => {
  const linkSchema = baseLinkSchema.notOneOf(
    watchedState.feeds.map(({ link }) => link),
  );

  const error = validate(watchedState.form.fields.link, linkSchema);
  watchedState.form.valid = !error;
  watchedState.form.error = watchedState.form.valid ? null : error;
};

export default ({
  elements: {
    fieldElements,
    form,
    submitButton,
  },
}, watchedState) => {
  yup.setLocale(yupLocale);
  const baseLinkSchema = yup.string().url().required();

  Object.entries(fieldElements).forEach(([name, element]) => {
    element.addEventListener('input', (e) => {
      watchedState.form.fields[name] = e.target.value;

      updateValidationState(watchedState, baseLinkSchema);
    });
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const feedsArr = watchedState.feeds.map(({ link }) => link);
    if (feedsArr.indexOf(watchedState.form.fields.link) !== -1) {
      watchedState.form.processState = '';
      submitButton.disabled = true;
      return;
    }
    watchedState.form.processState = 'sending';

    callAPI(watchedState.form.fields.link).then((res) => {
      try {
      } catch (err) {
        watchedState.form.processState = 'failed';
        return;
      }

      watchedState.form.processState = 'finished';
    }).catch(() => {
      watchedState.form.processState = 'failedNetwork';
    });
  });
};
