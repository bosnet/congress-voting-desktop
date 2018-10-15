import Vue from 'vue';
import Vuetify from 'vuetify';
import VueI18n from 'vue-i18n';
import AsyncComputed from 'vue-async-computed';
import 'vuetify/dist/vuetify.css';
import '@/assets/css/main.css';
import unit from '@/lib/unit';

import App from './App';
import router from './router';
import store from './store';

Vue.use(Vuetify);
Vue.use(VueI18n);
Vue.use(AsyncComputed);
if (!process.env.IS_WEB) Vue.use(require('vue-electron'));
Vue.config.productionTip = false;

Vue.filter('bos', (value) => {
  if (typeof value !== 'number' && typeof value !== 'string') {
    return value;
  }
  const formatter = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 8,
  });
  return formatter.format(unit.convert(value, 'gon', 'bos'));
});

const i18n = new VueI18n({
  locale: 'ko',
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
