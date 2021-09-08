import 'bootstrap/js/dist/modal';

import i18next from 'i18next';
import resources from './locales/index.js';

import initModel from './core/model.js';
import initView from './core/view.js';
import initController from './core/controller.js';

export default () => {
  const i18nInstance = i18next.createInstance();
  const defaultLanguage = 'en';

  i18nInstance.init({
    lng: defaultLanguage,
    resources,
  }).then(() => {
    const model = initModel(defaultLanguage);
    const watchedState = initView(model, i18nInstance);
    initController(model, watchedState);
  });
};
