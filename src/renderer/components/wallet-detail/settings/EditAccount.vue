<template>
  <div class="SettingsEditAccount">
    <div class="SettingsEditAccountBody">
      <v-text-field
            v-model="alias"
            ref="aliasText"
            :label="$t('your account alias')"
            :rules="aliasRules"
            required
            class="alias"
        />

      <button class="button" @click="update">{{$t('modify')}}</button>
    </div>
    <span class="delete-info">{{$t('do not use the account no longer')}}</span>
    <span class="delete" @click="dialog = true">{{$t('deleting account')}}</span>
    <v-dialog v-model="dialog" fullscreen persistent hide-overlay content-class="DeleteAccountOverlay">
      <div class="DeleteAccountDialog">
        <h3>{{$t('deleting account')}}</h3>
        <span>{{$t('please back the account up before deleting it')}}</span>
        <div class="img"></div>
        <!-- TODO: apply hover/active design -->
        <button class="button" @click="deleteAccount">{{$t('deleting account')}}</button>
        <img :src="closeIcon" @click="dialog = false" class="DeleteAccountDialogClose" alt="close"/>
      </div>
    </v-dialog>
    <bos-toast v-model="showMessage">{{$t('modified')}}</bos-toast>
  </div>
</template>

<script>
  import closeIcon from '../../../assets/svg/close.svg';

  export default {
    name: 'wallet-settings-edit-account',
    props: ['wallet'],
    components: {
    },
    data() {
      return {
        alias: this.wallet.title,
        aliasRules: [
          v => !!v || 'account alias is required',
        ],
        showMessage: false,
        dialog: false,
        closeIcon,
      };
    },
    watch: {
      wallet(w) {
        this.alias = w.title;
      },
    },
    methods: {
      async update() {
        await this.$store.dispatch('updateWallet', {
          title: this.$refs.aliasText.internalValue,
          address: this.wallet.address,
        });
        this.$emit('updateStatus');
        this.showMessage = true;
      },
      async deleteAccount() {
        await this.$store.dispatch('deleteWalletByAddress', this.wallet.address);
        this.$router.push('/wallets');
        this.dialog = false;
      },
    },
  };
</script>

<style>
  .SettingsEditAccountBody {
    background-color: #fff;
    padding: 50px;
    margin-bottom: 20px;
  }

  .SettingsEditAccountBody .v-input {
    width: 400px;
    margin: 0 auto;
  }

  .SettingsEditAccountBody .v-input .v-input__control {
    margin: 10px auto;
  }

  .SettingsEditAccountBody .button {
    margin: 30px auto 0;
  }

  .SettingsEditAccount {
    text-align: center;
  }

  .SettingsEditAccount .delete-info {
    font-size: 13px;
    color: #728395;
  }

  .SettingsEditAccount .delete {
    font-size: 13px;
    color: #ed6060;
    text-decoration: underline;
    cursor: pointer;
  }

  .SettingsEditAccount .toast--warn {
    margin-left: 158px;
  }

  .DeleteAccountOverlay {
    background-color: rgba(216, 223, 232, 0.7);
    height: 100%;
    width: 714px;
    margin-left: 158px;
    display: flex;
    align-items: center;
    justify-items: center;
  }

  .DeleteAccountDialog {
    padding: 80px;
    position: relative;
    width: 634px;
    height: 550px;
    border-radius: 2px;
    box-shadow: 0 6px 20px 0 rgba(178, 199, 220, 0.8);
    border: solid 1px #ececec;
    background-color: #ffffff;
    color: #333333;
    margin-left: 40px;
  }

  .DeleteAccountDialogClose {
    position: absolute;
    top: 30px;
    right: 30px;
    cursor: pointer;
  }

  .DeleteAccountDialog h3 {
    text-align: center;
    font-size: 30px;
    font-weight: bold;
  }

  .DeleteAccountDialog span {
    font-size: 14px;
    color: #333333;
    width: 250px;
    display: block;
    margin: 5px auto 0;
  }

  .DeleteAccountDialog .img {
    opacity: 0.2;
    background-color: #d8d8d8;
    width: 150px;
    height: 150px;
    border-radius: 100px;
    margin: 50px auto 58px;
  }

  .DeleteAccountDialog .button {
    margin: 0 auto;
    background-color: #ec6565;
  }
</style>
