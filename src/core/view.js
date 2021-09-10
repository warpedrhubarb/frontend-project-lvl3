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
    statusMsg,
    submitButton,
    feedsContainer,
    postsContainer,
    // previewButtons,
    // postsHeading,
    // feedsHeading,
    modalBody,
    modalTitle,
    modalLink,
    modalDismiss,
    appTitle,
    subtitle,
    inputPlaceholder,
    example,
  },
}, i18nInstance) => {
  const renderLng = () => {
    appTitle.textContent = i18nInstance.t('elements.title');
    subtitle.textContent = i18nInstance.t('elements.subtitle');
    submitButton.textContent = i18nInstance.t('elements.submitButton');
    inputPlaceholder.textContent = i18nInstance.t('elements.inputPlaceholder');
    example.textContent = i18nInstance.t('elements.example');

    // For full-size language buttons to be functional (switching styles):
    // lngButtons.forEach((lngBtn) => {
    //   const { lng } = lngBtn.dataset;
    //
    //   const classNameToAdd = language === lng ? 'btn-primary' : 'btn-outline-primary';
    //   const classNameToRemove = language === lng ? 'btn-outline-primary' : 'btn-primary';
    //   lngBtn.classList.remove(classNameToRemove);
    //   lngBtn.classList.add(classNameToAdd);
    // });

    const previewButtons = document.querySelectorAll('[data-role="previewBtn"]');
    const postsHeading = document.querySelector('[data-role="posts-heading"]');
    const feedsHeading = document.querySelector('[data-role="feeds-heading"]');

    previewButtons.forEach((previewBtn) => {
      previewBtn.textContent = i18nInstance.t('elements.previewBtn');
    });

    if (postsHeading) {
      postsHeading.textContent = i18nInstance.t('elements.posts');
    }
    if (feedsHeading) {
      feedsHeading.textContent = i18nInstance.t('elements.feeds');
    }

    modalLink.textContent = i18nInstance.t('elements.modalLink');
    modalDismiss.textContent = i18nInstance.t('elements.modalDismiss');
  };

  const renderInputValue = (value) => {
    fieldElements.link.value = value;
  };

  const renderStatusMsg = (statusMessage) => {
    const linkElement = fieldElements.link;
    linkElement.classList.remove('is-invalid');
    statusMsg.textContent = '';
    if (!statusMessage) {
      return;
    }
    statusMsg.textContent = i18nInstance.t(statusMessage.message.key);
    linkElement.classList.add('is-invalid');
  };

  const processStateHandler = (processState) => {
    switch (processState) {
      case 'failedNetwork':
        submitButton.disabled = false;
        fieldElements.link.readOnly = false;
        statusMsg.textContent = (i18nInstance.t('statusMessages.networkProblems'));
        break;
      case 'failed':
        submitButton.disabled = false;
        fieldElements.link.readOnly = false;
        statusMsg.textContent = (i18nInstance.t('statusMessages.invalidRSS'));
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
        // fieldElements.link.value = null;
        statusMsg.textContent = (i18nInstance.t('statusMessages.successRSSLoad'));
        break;
      default:
        statusMsg.textContent = (i18nInstance.t('statusMessages.RSSExists'));
    }
  };

  const renderFeeds = (feeds) => {
    feedsContainer.innerHTML = null;
    const card = createElement('card.border-0');
    const cardBody = createElement('div.card-body');

    const cardTitle = createElement('h2.card-title.h4', i18nInstance.t('elements.feeds'), { 'data-role': 'feeds-heading' });
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
    const { posts, readPosts } = state;

    const card = createElement('card.border-0');
    const cardBody = createElement('div.card-body');

    const cardTitle = createElement('h2.card-title.h4', i18nInstance.t('elements.posts'), { 'data-role': 'posts-heading' });
    const postsList = createElement('ul.list-group.border-0.rounded-0');

    posts.forEach(({ id, title, link }) => {
      const listItem = createElement('li.list-group-item.d-flex.justify-content-between.align-items-start.border-0.border-end-0');
      const postTitleFont = readPosts[id] ? '.fw-normal' : '.fw-bold';
      const postTitle = createElement(`a${postTitleFont}`, title, {
        href: link,
        target: '_blank',
        rel: 'noopener noreferrer',
        'data-role': 'link',
        'data-id': id,
      });

      const previewBtn = createElement('button.btn.btn-outline-primary.btn-sm', i18nInstance.t('elements.previewBtn'), {
        'data-bs-toggle': 'modal',
        'data-bs-target': '#modal',
        'data-id': id,
        'data-role': 'previewBtn',
      });

      listItem.appendChild(postTitle);
      listItem.appendChild(previewBtn);
      postsList.appendChild(listItem);
    });

    cardBody.appendChild(cardTitle);
    card.appendChild(cardBody);
    card.appendChild(postsList);
    postsContainer.appendChild(card);
  };

  const renderModal = ({ description, title, link } = {}) => {
    modalTitle.textContent = title;
    modalBody.textContent = description;
    modalLink.setAttribute('href', link);
  };

  return onChange(state, (path, value) => {
    switch (path) {
      case 'form.processState':
        renderStatusMsg(null);
        processStateHandler(value);
        break;
      case 'form.valid':
        submitButton.disabled = !value;
        break;
      case 'form.statusMsg':
        renderStatusMsg(value);
        break;
      case 'form.inputField':
        renderInputValue(value);
        break;
      case 'feeds':
        renderFeeds(value);
        break;
      case 'posts':
      case 'readPosts':
        renderPosts();
        break;
      case 'modalItem':
        renderModal(value);
        break;
      case 'lng':
        i18nInstance.changeLanguage(`${value}`).then(() => renderLng());
        if (state.form.statusMsg) {
          renderStatusMsg(state.form.statusMsg);
        } else if (state.form.processState) {
          processStateHandler(state.form.processState);
        }
        break;
      default:
        break;
    }
  });
};
