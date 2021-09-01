export default () => {
  const form = document.querySelector('[data-form="add-rss"]');
  const fieldElements = {
    link: form.querySelector('[name="url"]'),
  };
  const linkError = document.querySelector('[data-role="link-error"]');
  const submitButton = form.querySelector('button');
  const errorContainer = document.querySelector('[data-role="process-error"]');
  const successMsgContainer = document.querySelector('[data-role="process-success"]');
  const feedsContainer = document.querySelector('[data-role="feeds"]');
  const postsContainer = document.querySelector('[data-role="posts"]');
  return {
    state: {
      form: {
        processState: 'filling',
        error: null,
        valid: true,
        inputField: null,
      },
      feeds: [],
      posts: [],
    },
    elements: {
      form,
      fieldElements,
      linkError,
      submitButton,
      errorContainer,
      successMsgContainer,
      feedsContainer,
      postsContainer,
    },
  };
};
