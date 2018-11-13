import Vue from 'vue';
import VueI18n from 'vue-i18n';
import 'vuetify/dist/vuetify.css';
import '@/assets/css/main.css';
import * as Sentry from '@sentry/electron';
import config from '#config';

import bootstrap from './bootstrap';

import App from './App';
import router from './router';
import store from './store';

Sentry.init({
  dsn: config.sentry.dsn,
  enableNative: false,
});

bootstrap(Vue);

const i18n = new VueI18n({
  locale: navigator.language === 'ko' ? navigator.language : 'en',
  messages: {
    en: require('./i18n/en.json'),
    ko: require('./i18n/ko.json'),
  },
});

if (module.hot) {
  module.hot.accept(['./i18n/en.json', './i18n/ko.json'], () => {
    i18n.setLocaleMessage('en', require('./i18n/en.json'));
    i18n.setLocaleMessage('ko', require('./i18n/ko.json'));
  });
}

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  i18n,
  template: '<App/>',
}).$mount('#app');
