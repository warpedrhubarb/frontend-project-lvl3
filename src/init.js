import * as yup from 'yup';
import fetch from 'node-fetch';
import state from './state.js';
import watchedState from './view.js';

export default () => {
  const routes = {
    queryPath: () => 'https://hexlet-allorigins.herokuapp.com/get?disableCache=true&url=',
  };
  const getQueryString = (queryParameter) => `${routes.queryPath()}${encodeURIComponent(queryParameter)}`;

  const validate = (url) => yup.string()
    .url('invalidUrl')
    .required('notEmptyString')
    .notOneOf(state.channels.allChannels, 'hasUrlYet')
    .validate(url);

  const form = document.querySelector('[role="form"]');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    formData.get('url');
    const { url } = Object.fromEntries(formData);
    watchedState.form.processState = 'loading';
    validate(url).then(() => fetch(getQueryString(url)))
      .then((response) => response.json())
      .then(() => {
        state.channels.allChannels.push(url);
        watchedState.form.processState = 'loaded';
        form.reset();
      })
      .catch((err) => {
        if (err.message === "Cannot read property 'querySelector' of null") {
          watchedState.form.processError = 'notRss';
          watchedState.form.processState = 'failed';
          return;
        } if (err.name === 'FetchError') {
          watchedState.form.processError = 'network';
          watchedState.form.processState = 'failed';
          return;
        }
        watchedState.form.processError = err.message;
        watchedState.form.processState = 'failed';
      });
  });
};
