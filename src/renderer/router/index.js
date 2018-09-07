import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/wallets',
      name: 'wallet-list',
      component: require('@/components/WalletListPage').default,
    },
    {
      path: '/wallet/:address',
      name: 'wallet-detail',
      component: require('@/components/WalletDetailPage').default,
    },
    {
      path: '/wallets/new',
      name: 'wallet-new',
      component: require('@/components/WalletNewPage').default,
    },
    {
      path: '*',
      redirect: '/wallets',
    },
  ],
});
