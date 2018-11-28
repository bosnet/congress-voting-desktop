<template>
  <div class="RecoveryKey">
    <h1>{{$t('entering recovery key')}}</h1>
    <div class="content">
      <v-text-field
          :label="$t('enter your recovery key')"
          autofocus
          ref="recoveryKey"
          class="recovery"
      >
      </v-text-field>

      <v-text-field
          :label="$t('enter your passphrase')"
          :rules="[rules.check]"
          autofocus
          ref="passphrase"
          type="password"
      >
        <img :src="successIcon" slot="append" alt="success" v-if="success"/>
        <img :src="errorIcon" slot="append" alt="error" v-if="failed"/>
      </v-text-field>

    </div>
  </div>
</template>

<script>
  import Wallet from '@/lib/wallet';
  import successIcon from '../../assets/svg/input-success.svg';
  import errorIcon from '../../assets/svg/input-error.svg';

  export default {
    name: 'wallet-import-recovery-key',
    data() {
      return {
        successIcon,
        errorIcon,
        success: false,
        failed: false,
        decrypted: null,
        rules: {
          check: (seed) => {
            if (!seed) {
              this.failed = false;
              return true;
            }

            const recoveryKey = this.$refs.recoveryKey.internalValue;
            const passphrase = this.$refs.passphrase.internalValue;

            try {
              this.decrypted = Wallet.decryptWallet(passphrase, recoveryKey);
              if (this.decrypted) {
                this.failed = false;
                this.success = true;
                this.$emit('enable-next');
              }
              return true;
            } catch (e) {
              this.success = false;
              this.failed = true;
              this.$emit('disable-next');
              return this.$t('the passphrase is wrong');
            }
          },
        },
      };
    },
    methods: {
      seed() {
        return this.decrypted;
      },
    },
    mounted() {
      this.$store.state.App.ga.send('screenview', { cd: 'wallet-import-recovery-key' });
    },
  };
</script>

<style>
  .RecoveryKey .v-input {
    width: 400px;
    margin: 0 auto;
  }

  .RecoveryKey .recovery {
    margin-bottom: 35px;
  }
</style>
