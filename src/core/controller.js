import * as yup from 'yup';
// import {
//   uniqueId,
//   differenceWith,
// } from 'lodash';
// import fetch from 'node-fetch';
// import callAPI from '../libs/api';
// import yupLocale from '../locales/yup.js';

const validate = (url) => yup.string()
  .url('invalidUrl')
  .required('notEmptyString')
  .notOneOf(state.feeds, 'hasUrlYet')
  .validate(url);

const updateValidationState = (watchedState) => {
  const error = validate(watchedState.form.urlInput);
  watchedState.form.valid = !error;
  watchedState.form.error = watchedState.form.valid ? null : error;
};

export default ({
                  elements: {
                    urlInput,
                    form,
                  },
                }, watchedState) => {

  urlInput.addEventListener('input', (e) => {
    watchedState.form.processState = 'filling';
    watchedState.form.urlInput = e.target.value;
    updateValidationState(watchedState);
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    watchedState.form.processState = 'loaded';

    // callAPI(watchedState.form.urlInput).then((res) => {
    //   try {
    //     processRSSContent(res.data.contents, watchedState);
    //   } catch (err) {
    //     watchedState.form.processState = 'failed';
    //     return;
    //   }
    //
    //   watchedState.form.processState = 'loaded';
    // }).catch(() => {
    //   watchedState.form.processState = 'network';
    // });
  });




  // const routes = {
  //   queryPath: () => 'https://hexlet-allorigins.herokuapp.com/get?disableCache=true&url=',
  // };
  // const getQueryString = (queryParameter) => `${routes.queryPath()}${encodeURIComponent(queryParameter)}`;
  //
  // form.addEventListener('submit', (e) => {
  //   e.preventDefault();
  //   const formData = new FormData(e.target);
  //   formData.get('url');
  //   const { url } = Object.fromEntries(formData);
  //   watchedState.form.processState = 'loading';
  //   validate(url).then(() => fetch(getQueryString(url)))
  //     .then((response) => response.json())
  //     .then((/* data */) => {
  //       // const id = _.uniqueId();
  //       // const parsedUrl = parseLink(data.contents);
  //       // const { title, description, postsList } = parsedUrl;
  //       // const date = new Date();
  //       // model.channels.byId[id] = {
  //       //   url, id, title, description, postsList, lastPubDate: date,
  //       // };
  //       state.channels.allChannels.push(url);
  //       watchedState.form.processState = 'loaded';
  //       console.log(state.channels.allChannels);
  //       // watchedState.channels.allIds.push(id);
  //       form.reset();
  //     })
  //     .catch((err) => {
  //       if (err.message === "Cannot read property 'querySelector' of null") {
  //         watchedState.form.processError = 'notRss';
  //         watchedState.form.processState = 'failed';
  //         return;
  //       } if (err.name === 'FetchError') {
  //         watchedState.form.processError = 'network';
  //         watchedState.form.processState = 'failed';
  //         return;
  //       }
  //       watchedState.form.processError = err.message;
  //       watchedState.form.processState = 'failed';
  //     });
  // });


};
