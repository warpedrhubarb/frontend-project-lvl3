import onChange from 'on-change';
import state from './state.js';

const urlInput = document.querySelector('#url-input');
const feedbackDiv = document.querySelector('[role="feedback"]');
const submitButton = document.querySelector('[aria-label="add"]');

const renderFeedback = (info) => {
  switch (info) {
    case 'loading':
      feedbackDiv.classList.remove('text-danger');
      feedbackDiv.classList.add('text-success');
      urlInput.classList.remove('is-invalid');
      feedbackDiv.textContent = 'loading';
      break;
    case 'invalidUrl':
    case 'notEmptyString':
    case 'hasUrlYet':
    case 'notRss':
    case 'network':
      feedbackDiv.classList.remove('text-success');
      feedbackDiv.classList.add('text-danger');
      urlInput.classList.add('is-invalid');
      feedbackDiv.textContent = info;
      break;
    case 'filling':
      feedbackDiv.textContent = '';
      break;
    case 'loaded':
      feedbackDiv.classList.remove('text-danger');
      feedbackDiv.classList.add('text-success');
      urlInput.classList.remove('is-invalid');
      feedbackDiv.textContent = 'loaded';
      break;
    default:
      feedbackDiv.classList.remove('text-success');
      feedbackDiv.classList.add('text-danger');
      urlInput.classList.add('is-invalid');
      feedbackDiv.textContent = info;
  }
};

const processStateHandler = (processState) => {
  switch (processState) {
    case 'init: ready for processing':
      submitButton.disabled = false;
      break;
    case 'loading':
      submitButton.disabled = true;
      renderFeedback(processState);
      urlInput.setAttribute('readonly', 'readonly');
      break;
    case 'failed':
      submitButton.disabled = false;
      urlInput.removeAttribute('readonly');
      renderFeedback(state.form.processError);
      break;
    case 'filling':
      renderFeedback(processState);
      break;
    case 'loaded':
      submitButton.disabled = false;
      urlInput.removeAttribute('readonly');
      renderFeedback(processState);
      break;
    default:
      renderFeedback(`State Error: ${processState}`);
  }
};

const watchedState = onChange(state, (path, value) => {
  switch (path) {
    case 'form.processState':
      processStateHandler(value);
      break;
    case 'error':
      renderFeedback(value);
      break;
    default:
      renderFeedback(`Unknown Error: Path: ${path}, Value: ${value}`);
  }
});

urlInput.addEventListener('input', () => {
  watchedState.form.processState = 'filling';
});

export default watchedState;
