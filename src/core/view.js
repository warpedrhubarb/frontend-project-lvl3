import onChange from 'on-change';

export default ({
  state,
  elements: {
    fieldElements,
    linkError,
    submitButton,
    feedbackContainer,
    errorContainer,
    successMsgContainer,
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
      default:
        break;
    }
  });
};
