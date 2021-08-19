import onChange from 'on-change';

export default ({
  state,
  elements: {
    form,
    urlInput,
    submitButton,
    processStatusMsg,
  },
}, i18nextInstance) => {
  const renderStatusMsg = (status) => {
    switch (status) {
      case 'loading':
        processStatusMsg.classList.remove('text-danger');
        processStatusMsg.classList.add('text-success');
        urlInput.classList.remove('is-invalid');
        processStatusMsg.textContent = i18nextInstance.t('statusMessages.loading');
        break;
      case 'invalidUrl':
      case 'notEmptyString':
      case 'hasUrlYet':
      case 'notRss':
      case 'network':
        processStatusMsg.classList.remove('text-success');
        processStatusMsg.classList.add('text-danger');
        urlInput.classList.add('is-invalid');
        processStatusMsg.textContent = i18nextInstance.t(`statusMessages.${status}`);
        break;
      case 'filling':
        processStatusMsg.textContent = '';
        break;
      case 'loaded':
        processStatusMsg.classList.remove('text-danger');
        processStatusMsg.classList.add('text-success');
        urlInput.classList.remove('is-invalid');
        processStatusMsg.textContent = i18nextInstance.t('statusMessages.loaded');
        break;
      default:
        processStatusMsg.classList.remove('text-success');
        processStatusMsg.classList.add('text-danger');
        urlInput.classList.add('is-invalid');
        processStatusMsg.textContent = i18nextInstance.t(`statusMessages.${status}`);
    }
  };

  const processStateHandler = (processState) => {
    switch (processState) {
      case 'network':
        submitButton.disabled = false;
        urlInput.readOnly = false;
        renderStatusMsg(processState);
        break;
      case 'failed':
        submitButton.disabled = false;
        urlInput.readOnly = false;
        renderStatusMsg('invalidUrl');
        break;
      case 'filling':
        submitButton.disabled = false;
        urlInput.readOnly = false;
        break;
      case 'loading':
        submitButton.disabled = true;
        urlInput.readOnly = true;
        renderStatusMsg(processState);
        break;
      case 'loaded':
        submitButton.disabled = false;
        urlInput.readOnly = false;
        urlInput.value = null;
        renderStatusMsg(processState);
        break;
      default:
        throw new Error(`Unknown state: ${processState}`);
    }
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
      case 'form.error':
        renderStatusMsg(value);
        break;
      // case 'feeds':
      //   renderFeeds(value);
      //   break;
      // case 'posts':
      // case 'readPosts':
      //   renderPosts();
      //   break;
      // case 'modalItem':
      //   renderModal(value);
      //   break;
      default:
        break;
    }
  });
};
