<template>
  <v-dialog v-model="dialog" width="500" persistent>
    <div class="PasswordDialog">
      <!-- TODO: apply design -->
      <h3>패스워드를 입력하세요</h3>
      <div class="content">

        <v-text-field
            v-model="amount"
            ref="amountText"
            :rules="amountRules"
            :label="$t('unit')"
            required
            v-if="showUnit"
        />
        <v-text-field
            v-model="passphrase"
            ref="passphraseText"
            type="password"
            :rules="passphraseRules"
            :label="$t('passphrase')"
            required
        />
        <button class="button" @click="submit">승인</button>
      </div>
      <img :src="closeIcon" @click="dialog = false" class="PasswordDialogClose" alt="close"/>
    </div>
  </v-dialog>
</template>

<script>
  import closeIcon from '../../assets/svg/close.svg';

  export default {
    name: 'passphrase-dialog',
    props: ['callback', 'showUnit'],
    methods: {
      open() {
        this.dialog = true;
      },
      async submit() {
        await this.callback({
          amount: this.amount,
          passphrase: this.passphrase,
        });

        if (this.$refs.amountText) {
          this.$refs.amountText.reset();
        }
        if (this.$refs.passphraseText) {
          this.$refs.passphraseText.reset();
        }
        this.dialog = false;
      },
    },
    data() {
      return {
        dialog: false,
        passphrase: null,
        passphraseRules: [
          v => !!v || this.$t('enter your passphrase'),
        ],
        amount: null,
        amountRules: [
          v => !!v || 'Amount is required',
          v => (v > 0 && v % 10000 === 0) || 'Amount should be a multiple of 10000',
        ],
        closeIcon,
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
