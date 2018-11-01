<template>
  <div class="SettingsSecretSeed">
    <passphrase-dialog ref="passphraseDialog" :callback="showSecretSeed"/>
    <div class="SettingsSecretSeedBody" v-if="seed">
      <img :src="icon" />
      <h3>{{$t('secret seed')}}</h3>
      <span>{{$t('please keep your secret seed safely')}}</span>
      <hr>
      <button class="line-button" @click.stop="copy('#SettingsSecretSeed', 'addressCopied')">
        {{$t('copy')}}
        <v-tooltip top v-model="addressCopied">
          <span>copied</span>
          <span slot="activator"></span>
        </v-tooltip>
      </button>
      <span class="seed" id="SettingsSecretSeed">{{seed}}</span>
    </div>
    <bos-toast v-model="showMessage" :timeout="3000">{{message}}</bos-toast>
  </div>
</template>

<script>
  import Wallet from '@/lib/wallet';
  import Helper from '@/lib/helper';
  import SecretSeedIcon from '@/assets/svg/import-method-seed.svg';

  import PassphraseDialog from './PassphraseDialog';

  export default {
    name: 'bos-wallet-settings-secret-seed',
    props: ['wallet'],
    components: {
      PassphraseDialog,
    },
    data() {
      return {
        icon: SecretSeedIcon,
        addressCopied: false,
        showMessage: false,
        message: '',
        seed: null,
      };
    },
    mounted() {
      this.openPassphraseDialog();
    },
    methods: {
      copy(selector, tooltip) {
        const elem = document.querySelector(selector);
        Helper.copyToClipboard(elem);
        this.$data[tooltip] = true;
        setTimeout(() => {
          this.$data[tooltip] = false;
        }, 800);
      },
      openPassphraseDialog() {
        this.$refs.passphraseDialog.open();
      },
      async showSecretSeed({ passphrase }) {
        try {
          const seed = Wallet.decryptWallet(passphrase, this.wallet.data);
          this.seed = seed;
        } catch (err) {
          this.message = this.$t('passphrase is wrong');
          this.showMessage = true;
        }
      },
    },
  };
</script>

<style>
  .SettingsSecretSeedBody {
    background-color: #fff;
    padding: 50px;
    font-size: 14px;
    color: #333333;
  }

  .SettingsSecretSeedBody h3 {
    font-size: 30px;
    font-weight: bold;
    color: #333333;
    margin-bottom: 10px;
  }

  .SettingsSecretSeedBody img {
    float: right;
  }

  .SettingsSecretSeedBody > span {
    width: 400px;
    display: block;
    word-break: keep-all;
  }

  .SettingsSecretSeedBody hr {
    margin-top: 30px;
    margin-bottom: 30px;
    border: 1px solid #f1f2f3;

  }

  .SettingsSecretSeedBody .seed {
    font-size: 14px;
    color: #728395;
    width: 400px;
    display: inline-block;
    word-break: break-all;
  }

  .SettingsSecretSeedBody .line-button {
    display: inline-block;
    border-radius: 2px;
    border: solid 1px #7e919d;
    background-color: #ffffff;
    font-size: 10px;
    font-weight: bold;
    color: #7e919d;
    height: 30px;
    padding: 2px 8px;
    margin-top: 5px;
    float: right;
  }

  .SettingsSecretSeedBody .line-button:hover {
    border-color: #1289e5;
    color: #1289e5;
  }

  .SettingsSecretSeedBody .line-button:active {
    border-color: #1289e5;
    background-color: #1289e5;
    color: #ffffff;
  }
</style>
