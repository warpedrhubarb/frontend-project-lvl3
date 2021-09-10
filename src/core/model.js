export default (defaultLanguage) => {
  const form = document.querySelector('[data-form="add-rss"]');
  const lngButtons = document.querySelectorAll('[data-role="lng-btn"]');
  const fieldElements = {
    link: form.querySelector('[name="url"]'),
  };
  const statusMsg = document.querySelector('[data-role="status-msg"]');
  const submitButton = form.querySelector('button');
  const feedsContainer = document.querySelector('[data-role="feeds"]');
  const postsContainer = document.querySelector('[data-role="posts"]');
  const previewButtons = document.querySelectorAll('[data-role="previewBtn"]');
  const postsHeading = document.querySelector('[data-role="posts-heading"]');
  const feedsHeading = document.querySelector('[data-role="feeds-heading"]');
  const modalBody = document.querySelector('[data-role="modal-body"]');
  const modalTitle = document.querySelector('[data-role="modal-title"]');
  const modalLink = document.querySelector('[data-role="modal-link"]');
  const modalDismiss = document.querySelector('[data-role="modal-dismiss"]');
  const appTitle = document.querySelector('h1');
  const subtitle = document.querySelector('.lead');
  const inputPlaceholder = document.querySelector('label');
  const example = document.querySelector('[data-role="example"]');
  const exampleLinks = document.querySelectorAll('[data-role="example-link"]');

  return {
    state: {
      form: {
        processState: 'filling',
        statusMsg: null,
        valid: true,
        inputField: null,
      },
      feeds: [],
      posts: [],
      readPosts: {},
      modalItem: null,
      lng: defaultLanguage,
    },
    elements: {
      form,
      lngButtons,
      fieldElements,
      statusMsg,
      submitButton,
      feedsContainer,
      postsContainer,
      previewButtons,
      postsHeading,
      feedsHeading,
      modalBody,
      modalTitle,
      modalLink,
      modalDismiss,
      appTitle,
      subtitle,
      inputPlaceholder,
      example,
      exampleLinks,
    },
  };
};
