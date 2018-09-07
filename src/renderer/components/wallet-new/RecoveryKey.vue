<template>
  <v-flex xs12>
    <v-layout row wrap>
      <v-flex xs12>
        <v-text-field label="Recovery Key" ref="recoveryKey"/>
      </v-flex>
    </v-layout>
    <v-layout row wrap>
      <v-flex xs12>
        <v-text-field label="Passphrase" ref="passphrase" type="password"/>
      </v-flex>
    </v-layout>
  </v-flex>
</template>
<script>
  import wallet from '@/lib/wallet';

  export default {
    name: 'wallet-import-recovery-key',
    methods: {
      seed() {
        const recoveryKey = this.$refs.recoveryKey.inputValue;
        const passphrase = this.$refs.passphrase.inputValue;
        return wallet.decryptWallet(passphrase, recoveryKey);
      },
    },
  };
</script>
