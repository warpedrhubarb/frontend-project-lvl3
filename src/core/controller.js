import * as yup from 'yup';
import axios from 'axios';
import { differenceWith, uniqueId } from 'lodash';
import parseRSS from '../utils/rssParser';
import yupLocale from '../locales/yup.js';

const callAPI = (url) => axios.get(`https://hexlet-allorigins.herokuapp.com/get?url=${encodeURIComponent(url)}&disableCache=true`);

const handleSwitchLanguage = (watchedState) => (e) => {
  const { lng } = e.target.dataset;
  watchedState.lng = lng;
};

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

  const error = validate(watchedState.form.inputField, linkSchema);
  watchedState.form.valid = !error;
  watchedState.form.statusMsg = watchedState.form.valid ? null : error;
};

const processRSSContent = (data, watchedState) => {
  const { title, description, items } = parseRSS(data);
  const link = watchedState.form.inputField;
  const feedId = uniqueId();
  watchedState.feeds = [{
    link,
    title,
    description,
    feedId,
  }, ...watchedState.feeds];

  watchedState.posts = [
    ...items.map((item) => ({ ...item, id: uniqueId(), feedId })),
    ...watchedState.posts,
  ];
};

const updateFeeds = (watchedState) => {
  const timeout = 5000;
  const promises = watchedState.feeds.map(({ link }) => callAPI(link)
    .then((response) => {
      const newPosts = parseRSS(response.data.contents).items;
      const currentPosts = watchedState.posts;
      const diffPosts = differenceWith(newPosts, currentPosts, (a, b) => a.title === b.title);

      if (diffPosts.length) {
        watchedState.posts = [
          ...diffPosts,
          ...watchedState.posts,
        ];
      }
    }).catch((e) => console.log(e)));

  Promise.all(promises).finally(() => {
    setTimeout(() => updateFeeds(watchedState), timeout);
  });
};

export default ({
  elements: {
    lngButtons,
    fieldElements,
    form,
    submitButton,
    postsContainer,
    exampleLinks,
  },
}, watchedState) => {
  yup.setLocale(yupLocale);
  const baseLinkSchema = yup.string().url().required();

  lngButtons.forEach((lngBtn) => {
    lngBtn.addEventListener('click', handleSwitchLanguage(watchedState));
  });

  fieldElements.link.addEventListener('input', (e) => {
    watchedState.form.inputField = e.target.value;
    updateValidationState(watchedState, baseLinkSchema);
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const feedsArr = watchedState.feeds.map(({ link }) => link);
    if (feedsArr.indexOf(watchedState.form.inputField) !== -1) {
      watchedState.form.processState = '';
      submitButton.disabled = true;
      return;
    }
    watchedState.form.processState = 'sending';

    callAPI(watchedState.form.inputField).then((response) => {
      try {
        processRSSContent(response.data.contents, watchedState);
      } catch (error) {
        watchedState.form.processState = 'failed';
        return;
      }
      watchedState.form.processState = 'finished';
      updateFeeds(watchedState);
      watchedState.form.inputField = null;
    }).catch(() => {
      watchedState.form.processState = 'failedNetwork';
    });
  });

  exampleLinks.forEach((exampleLink) => {
    exampleLink.addEventListener('click', (e) => {
      e.preventDefault();
      watchedState.form.inputField = exampleLink.href;
      updateValidationState(watchedState, baseLinkSchema);
      fieldElements.link.focus();
    });
  });

  postsContainer.addEventListener('click', (e) => {
    const { id, bsToggle, role } = e.target.dataset;

    if (role === 'link') {
      watchedState.readPosts = {
        ...watchedState.readPosts,
        [id]: true,
      };
    }

    if (bsToggle !== 'modal') return;

    const currentPost = watchedState.posts.find(({ id: postId }) => postId === id);
    if (!currentPost) return;

    watchedState.modalItem = currentPost;

    watchedState.readPosts = {
      ...watchedState.readPosts,
      [id]: true,
    };
  });
};
