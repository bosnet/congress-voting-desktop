<template>
  <div class="SettingsRecoveryKey">
    <div class="SettingsRecoveryKeyBody">
      <img :src="icon" />
      <h3>{{$t('recovery key')}}</h3>
      <span>{{$t('please keep your recovery key safely')}}</span>
      <hr>
      <button class="line-button" @click.stop="copy('#SettingsRecoverKey', 'addressCopied')">
        {{$t('copy')}}
        <v-tooltip top v-model="addressCopied">
          <span>copied</span>
          <span slot="activator"></span>
        </v-tooltip>
      </button>
      <span class="recovery" id="SettingsRecoverKey">{{wallet.data}}</span>
    </div>
    <div class="SettingsChangePasswordBody">
      <h3>{{$t('changing passphrase')}}</h3>
      <v-text-field
          :label="$t('enter your old passphrase')"
          :rules="[rules.oldPassphrase]"
          ref="oldPassphrase"
          type="password"
          class="passphrase"
          required
      >
        <img :src="successIcon" slot="append" alt="success" v-if="oldPassphraseSuccess"/>
        <img :src="errorIcon" slot="append" alt="error" v-if="oldPassphraseFailed"/>
      </v-text-field>
      <v-text-field
          :label="$t('enter your passphrase')"
          :rules="[rules.passphrase]"
          ref="passphrase"
          type="password"
          class="passphrase"
          required
      >
        <img :src="successIcon" slot="append" alt="success" v-if="passphraseSuccess"/>
        <img :src="errorIcon" slot="append" alt="error" v-if="passphraseFailed"/>
      </v-text-field>

      <v-text-field
          :label="$t('enter your passphrase again')"
          :rules="[rules.passphraseConfirm]"
          ref="passphraseConfirm"
          type="password"
          class="passphrase"
          required
      >
        <img :src="successIcon" slot="append" alt="success" v-if="passphraseConfirmSuccess"/>
        <img :src="errorIcon" slot="append" alt="error" v-if="passphraseConfirmFailed"/>
      </v-text-field>
      <button class="button" :disabled="!passphraseChangable" @click="updatePassword">{{$t('modify')}}</button>
    </div>
    <bos-toast v-model="showMessage">{{message}}</bos-toast>
  </div>
</template>

<script>
  import Wallet from '@/lib/wallet';
  import Helper from '@/lib/helper';

  import RecoverKeyIcon from '../../../assets/svg/import-method-recovery-key.svg';
  import successIcon from '../../../assets/svg/input-success.svg';
  import errorIcon from '../../../assets/svg/input-error.svg';

  export default {
    name: 'wallet-settings-recovery-key',
    props: ['wallet'],
    data() {
      return {
        icon: RecoverKeyIcon,
        addressCopied: false,
        showMessage: false,
        message: '',
        successIcon,
        errorIcon,
        oldPassphraseSuccess: false,
        oldPassphraseFailed: false,
        passphraseSuccess: false,
        passphraseFailed: false,
        passphraseConfirmSuccess: false,
        passphraseConfirmFailed: false,
        passphraseChangable: false,
        rules: {
          oldPassphrase: (input) => {
            if (!input) { return true; }
            const passed = input && input.length > 6;
            if (passed) {
              this.oldPassphraseFailed = false;
              this.oldPassphraseSuccess = true;
              return true;
            }

            this.oldPassphraseSuccess = false;
            this.oldPassphraseFailed = true;
            return this.$t('enter your passphrase');
          },
          passphrase: (input) => {
            if (!input) { return true; }
            const passed = input && input.length > 6;
            if (passed) {
              this.passphraseFailed = false;
              this.passphraseSuccess = true;
              return true;
            }

            this.passphraseSuccess = false;
            this.passphraseFailed = true;
            return this.$t('given passphrase length is not enough');
          },
          passphraseConfirm: () => {
            if (!this.$refs.passphraseConfirm) { return true; }

            const passphrase = this.$refs.passphrase.internalValue;
            if (passphrase === this.$refs.passphraseConfirm.internalValue) {
              this.passphraseConfirmFailed = false;
              this.passphraseConfirmSuccess = true;
              if (this.$refs.oldPassphrase.internalValue) {
                this.passphraseChangable = true;
              }
              return true;
            }

            this.passphraseConfirmSuccess = false;
            this.passphraseConfirmFailed = true;
            this.$emit('disable-next');
            return this.$t('both passphrases are not same');
          },
        },
      };
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
      async updatePassword() {
        const old = this.$refs.oldPassphrase.internalValue;
        let seed;
        try {
          seed = Wallet.decryptWallet(old, this.wallet.data);
        } catch (err) {
          this.message = this.$t('passphrase is wrong');
          this.showMessage = true;
          return;
        }

        const passphrase = this.$refs.passphrase.internalValue;
        const data = Wallet.encryptWallet(passphrase, seed);
        await this.$store.dispatch('updateWallet', {
          address: this.wallet.address,
          data,
        });
        this.message = this.$t('modified');
        this.showMessage = true;
        this.$emit('updateStatus');
        this.$refs.oldPassphrase.reset();
        this.$refs.passphrase.reset();
        this.$refs.passphraseConfirm.reset();
      },
    },
  };
</script>

<style>
  .SettingsRecoveryKeyBody {
    background-color: #fff;
    padding: 50px;
    font-size: 14px;
    color: #333333;
  }

  .SettingsRecoveryKeyBody h3 {
    font-size: 30px;
    font-weight: bold;
    color: #333333;
    margin-bottom: 10px;
  }

  .SettingsRecoveryKeyBody img {
    float: right;
  }

  .SettingsRecoveryKeyBody > span {
    width: 400px;
    display: block;
    word-break: keep-all;
  }

  .SettingsRecoveryKeyBody hr {
    margin-top: 30px;
    margin-bottom: 30px;
    border: 1px solid #f1f2f3;
  }

  .SettingsRecoveryKeyBody .recovery {
    font-size: 14px;
    color: #728395;
    width: 400px;
    display: inline-block;
    word-break: break-all;
  }

  .SettingsRecoveryKeyBody .line-button {
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

  .SettingsRecoveryKeyBody .line-button:hover {
    border-color: #1289e5;
    color: #1289e5;
  }

  .SettingsRecoveryKeyBody .line-button:active {
    border-color: #1289e5;
    background-color: #1289e5;
    color: #ffffff;
  }

  .SettingsChangePasswordBody {
    background-color: #fff;
    padding: 50px;
    font-size: 14px;
    color: #333333;
    margin-top: 10px;
  }

  .SettingsChangePasswordBody h3 {
    font-size: 30px;
    font-weight: bold;
    color: #333333;
    margin-bottom: 30px;
  }

  .SettingsChangePasswordBody .v-input {
    width: 400px;
    margin: 0 auto;
  }

  .SettingsChangePasswordBody .passphrase {
    margin-top: 10px;
    margin-bottom: 20px;
  }

  .SettingsChangePasswordBody .button {
    margin: 40px auto 0;
  }
</style>
