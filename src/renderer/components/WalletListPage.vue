<template>
  <v-container class="WalletListPage">
    <wallet-list :wallets="wallets" v-if="wallets.length > 0" :notify="notify" :reload="load" />
    <div slot="activator" @click="addAccount" class="round-button" v-show="!dialog" v-if="wallets.length > 0">
      <img :src="addBtn" :alt="$t('add account')" />
    </div>
    <v-dialog v-model="dialog" fullscreen hide-overlay v-if="wallets.length > 0">
      <wallet-new :close="close" />
    </v-dialog>
    <!-- TODO: add right click side menu to remove account which has no balance -->
    <v-layout v-if="loaded && wallets.length == 0">
      <v-flex class="empty">
        <h2>{{$t('welcome')}}</h2>
        <h1>{{$t('add your account and attend congress voting')}}</h1>
        <img :src="welcomeImg"/>

        <v-dialog v-model="dialog" fullscreen hide-overlay>
          <button slot="activator" class="button">{{$t('add account')}}</button>
          <wallet-new :close="close" />
        </v-dialog>
      </v-flex>
    </v-layout>
    <div :class="['notification', membershipStatus]" v-show="showNotification">
      {{notificationContent}}
      <router-link :to="notificationMoveTarget" v-if="membershipStatus === 'rejected'">{{$t('try again')}}</router-link>
    </div>
    <bos-toast v-model="showMessage" :timeout="3000">{{message}}</bos-toast>
    <bos-shutdown v-if="shutdown"></bos-shutdown>
  </v-container>
</template>

<script>
  import Helper from '@/lib/helper';

  import WalletList from './wallet-list/WalletList';
  import WalletNew from './WalletNewPage';

  import welcomeImg from '../assets/svg/home-welcome.svg';
  import addBtn from '../assets/svg/home-add-btn.svg';

  export default {
    name: 'wallet-list-page',
    components: {
      WalletList,
      WalletNew,
    },
    mounted() {
      this.$store.state.App.ga.send('screenview', { cd: 'wallet-list-page' });
      this.$root.$on('tick', this.load);
      this.$root.$on('long-tick', this.checkup);
      this.checkup();
      this.load();
    },
    destroyed() {
      this.$root.$off('tick', this.load);
      this.$root.$off('long-tick', this.checkup);
    },
    computed: {
      wallets() {
        return this.$store.state.Wallet.wallets;
      },
    },
    data() {
      return {
        dialog: false,
        loaded: false,
        welcomeImg,
        addBtn,
        showNotification: true,
        membershipStatus: null,
        notificationContent: null,
        notificationMoveTarget: null,
        showMessage: false,
        message: '',
        shutdown: false,
      };
    },
    methods: {
      load() {
        this.$store.dispatch('loadWallets').then(() => {
          this.loaded = true;
        });
      },
      close() {
        this.dialog = false;
      },
      notify(type, address) {
        this.membershipStatus = type;
        if (type === 'pending') {
          this.notificationContent = this.$t('verifying your identity');
        } else if (type === 'rejected') {
          this.notificationContent = this.$t('your identity verification failed');
          this.notificationMoveTarget = `/wallet/${address}/#voting`;
        } else if (type === 'verified') {
          this.notificationContent = this.$t('your identity is verified');
        } else {
          this.notificationContent = '';
        }
        return '';
      },
      addAccount() {
        if (this.wallets.length > 0) {
          this.message = this.$t('currently only one account allowed. If you want another account, please remove current one');
          this.showMessage = true;
        } else {
          this.dialog = true;
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
  };
</script>

<style>
  .WalletListPage {
    color: #728395;
    padding: 50px;
    display: block;
  }

  .WalletListPage .empty {
    padding-top: 34px;
    text-align: center;
  }

  .WalletListPage .empty h2 {
    font-size: 25px;
    margin: 0;
  }

  .WalletListPage .empty h1 {
    font-size: 30px;
  }

  .WalletListPage .empty img {
    margin: 37px auto 0;
    display: block;
  }

  .WalletListPage .empty .button {
    margin: 52px auto 0;
  }

  .WalletListPage .dialog {
    padding: 34px;
  }

  .WalletListPage .round-button {
    display: block;
    width: 60px;
    height: 60px;
    border-radius: 30px;
    box-shadow: 0 4px 7px 0 #95caf4;
    background-color: #1993f1;
    text-align: center;
    position: fixed;
    bottom: 40px;
    right: 50px;
    cursor: pointer;
  }

  .WalletListPage .round-button img {
    width: 24px;
    height: 60px;
  }

  .WalletListPage .round-button:hover {
    background-color: #1289e5;
  }

  .WalletListPage .round-button:active {
    background-color: #1866b0;
  }

  .WalletListPage .round-button:disabled {
    background-color: #86c0ed;
  }

  .WalletListPage .notification {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 40px;
    font-size: 15px;
    color: #ffffff;
    text-align: center;
    line-height: 40px;
  }

  .WalletListPage .notification a {
    margin-left: 15px;
    color: #ffffff;
    text-decoration: underline;
  }

  .WalletListPage .notification.pending {
    background-color: #1792f0;
  }
  .WalletListPage .notification.rejected {
    background-color: #ed6060;
  }
  .WalletListPage .notification.verified {
    background-color: #50b37c;
  }
</style>
