<template>
  <v-container class="wallet-detail-container" v-if="wallet != null">
    <bos-wallet-sidebar :wallet="wallet" :activeMenu="activeMenu"/>
    <div class="wallet-detail-container-content">
      <bos-wallet-header :wallet="wallet" :title="title"/>
      <bos-wallet-account-section :wallet="wallet" :activeMenu="activeSubMenu" v-if="activeMenu == 'account'"/>
      <bos-wallet-proposal-section :wallet="wallet" v-else-if="activeMenu == 'voting'"/>
      <bos-wallet-settings-section :wallet="wallet" :activeMenu="activeSubMenu" @tab="anchor" v-else/>
    </div>
    <bos-passphrase-dialog ref="passphraseDialog"/>
    <bos-shutdown v-if="shutdown"></bos-shutdown>
  </v-container>
</template>

<script>
  import Helper from '@/lib/helper';

  export default {
    name: 'wallet-detail-page',
    data() {
      return {
        activeMenu: '',
        activeSubMenu: '',
        shutdown: false,
      };
    },
    methods: {
      promptPassphrase(title, options) {
        return new Promise((resolve => this.$refs.passphraseDialog.open({
          title,
          options,
          confirmCallback: resolve,
        })));
      },
      updateRouteInfo() {
        const pair = (this.$route.hash || '').split('-');
        this.activeMenu = (pair[0] || '#account').replace('#', '');
        this.activeSubMenu = pair.length >= 2 ? pair.slice(1).join('-') : '';
      },
      anchor(tab) {
        this.$router.push(`/wallet/${this.wallet.address}/#${this.activeMenu}-${tab}`);
      },
      load() {
        if (this.wallet.membership && this.wallet.membership.status === 'verified') {
          this.$store.dispatch('loadFrozenAccounts', this.wallet.address);
          if (this.$store.state.RPC.frozenAccountOps.length > 0) {
            this.$store.dispatch('registerMembership', {
              address: this.wallet.address,
            });
          }
        }
        if (this.wallet.membership && this.membership.status && this.membership.status !== 'active') {
          this.$store.dispatch('updateMembership', { wallets: [this.wallet], mutable: false });
        }
      },
      async checkup() {
        const onTime = await Helper.checkup();
        this.shutdown = onTime;
        if (onTime && !this.shutdown) {
          this.$root.$off('tick', this.load);
          this.shutdown = true;
        } else if (!onTime && this.shutdown) {
          this.$root.$on('tick', this.load);
          this.shutdown = false;
        }
      },
    },
    computed: {
      wallet() {
        return this.$store.state.App.currentWallet;
      },
      membership() {
        return this.wallet.membership;
      },
      title() {
        return this.$t(`menu#${this.activeMenu}`);
      },
    },
    watch: {
      $route() {
        this.updateRouteInfo();
      },
    },
    mounted() {
      this.updateRouteInfo();
      this.$store.dispatch('loadWallet', this.$route.params.address);
      this.$root.$on('tick', this.load);
      this.$root.$on('long-tick', this.checkup);
    },
    destroyed() {
      this.$root.$off('tick', this.load);
      this.$root.$off('long-tick', this.checkup);
    },
  };
</script>

<style>
  .wallet-detail-container {
    margin: 0;
    padding: 0;
    height: 100%;
    width: 100%;
    max-width: none;
  }

  .wallet-detail-container-content {
    padding-left: 158px;
  }
</style>
