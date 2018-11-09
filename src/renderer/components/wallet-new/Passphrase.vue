<template>
  <div class="NewPassphrase">
    <h1>{{$t('setting a new passphrase')}}</h1>
    <div class="content">
      <v-text-field
          :label="$t('enter your passphrase')"
          :rules="[rules.pass1length]"
          autofocus
          ref="passphrase"
          type="password"
          class="passphrase"
      >
        <img :src="successIcon" slot="append" alt="success" v-if="pass1success"/>
        <img :src="errorIcon" slot="append" alt="error" v-if="pass1failed"/>
      </v-text-field>

      <v-text-field
          :label="$t('enter your passphrase again')"
          :rules="[rules.pass2check]"
          ref="passphraseConfirm"
          type="password"
      >
        <img :src="successIcon" slot="append" alt="success" v-if="pass2success"/>
        <img :src="errorIcon" slot="append" alt="error" v-if="pass2failed"/>
      </v-text-field>
    </div>
  </div>
</template>

<script>
  import Helper from '@/lib/helper';

  import successIcon from '../../assets/svg/input-success.svg';
  import errorIcon from '../../assets/svg/input-error.svg';

  export default {
    name: 'wallet-import-passphrase',
    props: ['passed'],
    data() {
      return {
        successIcon,
        errorIcon,
        pass1success: false,
        pass1failed: false,
        pass2success: false,
        pass2failed: false,
        rules: {
          pass1length: (input) => {
            if (!input) { return true; }

            if (Helper.isValidPassphrase(input)) {
              this.pass1failed = false;
              this.pass1success = true;
              return true;
            }

            this.pass1success = false;
            this.pass1failed = true;
            return this.$t('passphrase should be 8 characters which contain alphanumeric and special character');
          },
          pass2check: () => {
            if (!this.$refs.passphraseConfirm) { return true; }

            const passphrase = this.$refs.passphrase.internalValue;
            if (passphrase === this.$refs.passphraseConfirm.internalValue) {
              this.pass2failed = false;
              this.pass2success = true;
              console.log(this);
              return true;
            }

            this.pass2success = false;
            this.pass2failed = true;
            return this.$t('both passphrases are not same');
          },
        },
      };
    },
    watch: {
      pass1success(v) {
        if (v && this.pass2success) {
          this.$emit('enable-next');
        } else {
          this.$emit('disable-next');
        }
      },
      pass2success(v) {
        if (v && this.pass1success) {
          this.$emit('enable-next');
        } else {
          this.$emit('disable-next');
        }
      },
    },
    methods: {
      value() {
        return this.$refs.passphrase.internalValue;
      },
    },
  };
</script>

<style>
  .NewPassphrase .v-input {
    width: 400px;
    margin: 0 auto;
  }

  .NewPassphrase .passphrase {
    margin-bottom: 35px;
  }
</style>
