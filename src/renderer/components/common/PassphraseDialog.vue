<template>
  <v-dialog v-model="show" fullscreen persistent hide-overlay lazy-validation content-class="PassphraseDialogOverlay">
    <div class="PassphraseDialog">
      <h3>{{$t('confirm passphrase')}}</h3>
      <span>&nbsp;{{ desc }}&nbsp;</span>
      <v-text-field v-model="data.passphrase" ref="passphraseText" type="password"
                    :rules="passphraseRules" :label="$t('enter your passphrase')" required/>
      <button class="button" @click="confirm" :disabled="!valid">{{$t('confirm')}}</button>
      <img :src="closeIcon" @click="close()" class="PassphraseDialogClose" alt="close"/>
    </div>
  </v-dialog>
</template>

<script>
  import closeIcon from '@/assets/svg/close.svg';

  export default {
    name: 'passphrase-dialog',
    props: ['callback'],
    methods: {
      open({ desc, confirmCallback }) {
        this.show = true;
        this.desc = desc;
        this.confirmCallback = confirmCallback;
      },
      confirm() {
        if (this.confirmCallback) {
          this.confirmCallback(Object.assign({}, this.data));
        }
        this.close();
      },
      close() {
        this.data = {};
        this.valid = false;
        this.show = false;
      },
    },
    data() {
      return {
        show: false,
        valid: false,
        desc: null,
        closeIcon,
        confirmCallback: null,
        data: {},
        passphrase: null,
        passphraseRules: [
          (v) => {
            if (!v) {
              return 'Passphrase is required';
            }
            this.valid = true;
            return !!v;
          },
        ],
      };
    },
  };
</script>

<style>
  .PassphraseDialogOverlay {
    background-color: rgba(216, 223, 232, 0.7);
    height: 100%;
    width: 714px;
    margin-left: 158px;
    display: flex;
    align-items: center;
    justify-items: center;
  }

  .PassphraseDialog {
    padding: 80px 36px 31px;
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

  .PassphraseDialogClose {
    position: absolute;
    top: 30px;
    right: 30px;
    cursor: pointer;
  }

  .PassphraseDialog h3 {
    text-align: center;
    font-size: 30px;
    font-weight: bold;
  }

  .PassphraseDialog span {
    font-size: 14px;
    color: #333333;
    display: block;
    margin: 5px auto 0;
    text-align: center;
  }

  .PassphraseDialog .button {
    margin: 0 auto;
  }

  .PassphraseDialog .v-input {
    width: 400px;
    margin: 72px auto 125px;
  }
</style>
