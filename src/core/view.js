import onChange from 'on-change';

const createElement = (selector, textContent = null, attributes = {}) => {
  const [tag, ...classes] = selector.split('.');
  const element = document.createElement(tag);
  element.textContent = textContent;
  element.classList.add(...classes);
  Object.entries(attributes).forEach(([attribute, value]) => {
    element.setAttribute(attribute, value);
  });
  return element;
};

export default ({
  state,
  elements: {
    fieldElements,
    linkError,
    submitButton,
    errorContainer,
    successMsgContainer,
    feedsContainer,
    postsContainer,
  },
}, i18nInstance) => {
  const renderError = (error) => {
    const linkEl = fieldElements.link;
    linkEl.classList.remove('is-invalid');
    linkError.textContent = '';
    if (!error) {
      return;
    }
    linkError.textContent = i18nInstance.t(error.message.key);
    linkEl.classList.add('is-invalid');
  };

  const renderFeeds = (feeds) => {
    feedsContainer.innerHTML = null;
    const card = createElement('card.border-0');
    const cardBody = createElement('div.card-body');

    const cardTitle = createElement('h2.card-title.h4', i18nInstance.t('elements.feeds'), { 'data-role': 'feedsTitle' });
    const feedsInfoList = createElement('ul.list-group.border-0.rounded-0');
    feeds.forEach(({ title, description }) => {
      const listItem = createElement('li.list-group-item.border-0.border-end-0');
      const feedTitle = createElement('h3.h6.m-0', title);
      const feedDescription = createElement('p.m-0.small.text-black-50', description);
      listItem.appendChild(feedTitle);
      listItem.appendChild(feedDescription);
      feedsInfoList.appendChild(listItem);
    });

    cardBody.appendChild(cardTitle);
    card.appendChild(cardBody);
    card.appendChild(feedsInfoList);
    feedsContainer.appendChild(card);
  };

  const renderPosts = () => {
    postsContainer.innerHTML = null;
    const { posts } = state;

    const card = createElement('card.border-0');
    const cardBody = createElement('div.card-body');

    const cardTitle = createElement('h2.card-title.h4', i18nInstance.t('elements.posts'), { 'data-role': 'postsTitle' });
    const postsList = createElement('ul.list-group.border-0.rounded-0');

    posts.forEach(({ id, title, link }) => {
      const listItem = createElement('li.list-group-item.d-flex.justify-content-between.align-items-start.border-0.border-end-0');
      const postTitle = createElement('a', title, { href: link, target: '_blank', rel: 'noopener noreferrer' });
      const button = createElement('button.btn.btn-outline-primary.btn-sm', i18nInstance.t('elements.preview'), {
        'data-bs-toggle': 'modal',
        'data-bs-target': '#modal',
        'data-id': id,
        'data-role': 'preview',
      });

      listItem.appendChild(postTitle);
      listItem.appendChild(button);
      postsList.appendChild(listItem);
    });

    cardBody.appendChild(cardTitle);
    card.appendChild(cardBody);
    card.appendChild(postsList);
    postsContainer.appendChild(card);
  };

  const renderProcessError = (text) => {
    errorContainer.textContent = text;
  };

  const renderSuccessMessage = (text) => {
    successMsgContainer.textContent = text;
  };

  const processStateHandler = (processState) => {
    switch (processState) {
      case 'failedNetwork':
        submitButton.disabled = false;
        fieldElements.link.readOnly = false;
        renderProcessError(i18nInstance.t('networkProblems'));
        break;
      case 'failed':
        submitButton.disabled = false;
        fieldElements.link.readOnly = false;
        renderProcessError(i18nInstance.t('invalidRSS'));
        break;
      case 'filling':
        submitButton.disabled = false;
        fieldElements.link.readOnly = false;
        break;
      case 'sending':
        submitButton.disabled = true;
        fieldElements.link.readOnly = true;
        break;
      case 'finished':
        submitButton.disabled = false;
        fieldElements.link.readOnly = false;
        fieldElements.link.value = null;
        renderSuccessMessage(i18nInstance.t('successRSSLoad'));
        break;
      default:
        throw new Error(`Unknown state: ${processState}`);
    }
  };

  return onChange(state, (path, value) => {
    switch (path) {
      case 'form.processState':
        renderProcessError(null);
        renderSuccessMessage(null);
        processStateHandler(value);
        break;
      case 'form.valid':
        submitButton.disabled = !value;
        break;
      case 'form.error':
        renderError(value);
        break;
      case 'feeds':
        renderFeeds(value);
        break;
      case 'posts':
        renderPosts();
        break;
      default:
        break;
    }
  });
};
