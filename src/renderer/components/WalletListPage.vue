<template>
  <v-container class="WalletListPage">
    <wallet-list :wallets="wallets" v-show="wallets.length > 0"/>
    <v-dialog v-model="dialog" fullscreen hide-overlay v-if="wallets.length > 0">
      <div slot="activator" class="round-button" v-show="!dialog">
        <img :src="addBtn" :alt="$t('add account')" />
      </div>
      <wallet-new :close="close" />
    </v-dialog>
    <v-layout>
      <v-flex v-show="wallets.length == 0" class="empty">
        <h2>{{$t('welcome')}}</h2>
        <h1>{{$t('add your account and attend congress voting')}}</h1>
        <div class="img"></div>

        <v-dialog v-model="dialog" fullscreen hide-overlay>
          <button slot="activator" class="button">{{$t('add account')}}</button>
          <wallet-new :close="close" />
        </v-dialog>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import WalletList from './wallet-list/WalletList';
  import WalletNew from './WalletNewPage';

  import addBtn from '../assets/svg/home-add-btn.svg';

  export default {
    name: 'wallet-list-page',
    components: {
      WalletList,
      WalletNew,
    },
    mounted() {
      this.$store.dispatch('loadWallets');
      this.$store.dispatch('clearSideLinks');
    },
    computed: {
      wallets() {
        return this.$store.state.Wallet.wallets;
      },
    },
    data() {
      return {
        dialog: false,
        addBtn,
      };
    },
    methods: {
      close() {
        this.$data.dialog = false;
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
    font-size: 30px;
    margin: 0;
  }

  .WalletListPage .empty h1 {
    font-size: 25px;
    margin: 5px 0 0 0;
  }

  .WalletListPage .empty .img {
    width: 215px;
    height: 215px;
    border-radius: 108px;
    background-color: #ffffff;
    opacity: 0.5;
    margin: 45px auto 0;
  }

  .WalletListPage .empty .button {
    margin: 60px auto 0;
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
</style>
