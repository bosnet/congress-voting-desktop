<template>
  <v-layout row wrap>
    <wallet-list-item v-if="wallets.length > 0" :wallet="wallet" v-for="wallet in wallets"/>
  </v-layout>
</template>

<script>
  import WalletListItem from './WalletListItem';

  export default {
    props: ['wallets'],
    components: { WalletListItem },
  };
</script>

<style>
</style>
