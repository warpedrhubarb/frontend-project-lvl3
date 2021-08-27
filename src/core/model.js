export default (defaultLanguage) => {
  const form = document.querySelector('[data-form="add-rss"]');
  const fieldElements = {
    link: form.querySelector('[name="url"]'),
  };
  const linkError = document.querySelector('[data-role="link-error"]');
  const submitButton = form.querySelector('button');
  const feedbackContainer = document.querySelector('#feedback');
  const errorContainer = document.querySelector('[data-role="process-error"]');
  const successMsgContainer = document.querySelector('[data-role="process-success"]');

  return {
    state: {
      form: {
        processState: 'filling',
        error: null,
        valid: true,
        fields: {
          link: null,
        },
      },
      feeds: [],
    },
    elements: {
      form,
      fieldElements,
      linkError,
      submitButton,
      feedbackContainer,
      errorContainer,
      successMsgContainer,
    },
  };
};
