import Vuetify from 'vuetify';
import VueI18n from 'vue-i18n';
import AsyncComputed from 'vue-async-computed';

import * as componentMap from '@/components/components';
import unit from './lib/unit';

function installComponents(vue) {
  Object.keys(componentMap).forEach(name => vue.component(name, componentMap[name]));
}

export default (Vue) => {
  Vue.config.productionTip = false;

  Vue.use(Vuetify);
  Vue.use(VueI18n);
  Vue.use(AsyncComputed);
  if (!process.env.IS_WEB) Vue.use(require('vue-electron'));

  Vue.filter('bos', (value) => {
    if (typeof value !== 'number' && typeof value !== 'string') {
      return value;
    } else if (value === '-') {
      return '-';
    }

    const formatter = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 8,
    });
    return formatter.format(unit.convert(value, 'gon', 'bos'));
  });

  installComponents(Vue);

  return Vue;
};
