export default () => {
  const form = document.querySelector('form');
  const urlInput = form.querySelector('[name="url"]');
  const submitButton = form.querySelector('button');
  const processStatusMsg = document.querySelector('#feedback');
  // const feedsContainer = document.querySelector('#feeds');
  // const postsContainer = document.querySelector('#posts');
  // const modalBody = document.querySelector('[data-role="modal-body"]');
  // const modalTitle = document.querySelector('[data-role="modal-title"]');
  // const modalLink = document.querySelector('[data-role="modal-link"]');

  return {
    state: {
      form: {
        processState: 'filling',
        error: null,
        valid: true,
        urlInput: null,
      },
      feeds: [],
      // posts: [],
      // readPosts: {},
      // modalItem: null,
    },
    elements: {
      form,
      urlInput,
      submitButton,
      processStatusMsg,
      // feedsContainer,
      // postsContainer,
      // modalBody,
      // modalTitle,
      // modalLink,
    },
  };
};
