<template>
  <v-dialog v-model="show" persistent max-width="500" row justify-center lazy-validation>
    <div class="PasswordDialog">
      <v-form ref="form" v-model="valid">
        <h3>{{ title }}</h3>
        <div class="content">
          <v-text-field v-model="data.passphrase" ref="passphraseText" type="password"
                        :rules="passphraseRules" :label="$t('passphrase')" required/>
          <button class="button" flat @click="confirm" :disabled="!valid">
            {{$t('confirm')}}
          </button>
        </div>
        <img :src="closeIcon" @click="close()" class="PasswordDialogClose" alt="close"/>
      </v-form>
    </div>
  </v-dialog>
</template>

<script>
  import closeIcon from '@/assets/svg/close.svg';

  export default {
    name: 'passphrase-dialog',
    props: ['callback'],
    methods: {
      open({ title, confirmCallback }) {
        this.show = true;
        this.title = title;
        this.confirmCallback = confirmCallback;
      },
      confirm() {
        if (this.$refs.form.validate()) {
          if (this.confirmCallback) {
            this.confirmCallback(Object.assign({}, this.data));
          }
          this.close();
        }
      },
      close() {
        this.$refs.form.reset();
        this.show = false;
      },
    },
    data() {
      return {
        show: false,
        valid: false,
        title: null,
        closeIcon,
        confirmCallback: null,
        data: {},
        passphrase: null,
        passphraseRules: [
          v => !!v || 'Passphrase is required',
        ],
      };
    },
  };
</script>

<style>
  .PasswordDialog {
    background-color: #eaf0f7;
    color: #728395;
    padding: 30px;
    position: relative;
  }

  .PasswordDialogClose {
    position: absolute;
    top: 20px;
    right: 20px;
    cursor: pointer;
  }

  .PasswordDialog h3 {
    text-align: center;
  }

  .PasswordDialog .button {
    margin: 30px auto 30px;
  }
</style>
