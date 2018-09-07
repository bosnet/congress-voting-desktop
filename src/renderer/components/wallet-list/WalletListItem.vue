<template>
  <v-flex xs12>
    <v-card :to="`/wallet/${wallet.address}`">
      <v-card-title primary-title>
        <div class="headline">{{ wallet.title }}</div>
      </v-card-title>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn flat>{{ wallet.balance | numberFormat }} <strong>BOS</strong></v-btn>
      </v-card-actions>
    </v-card>
  </v-flex>
</template>

<script>
  export default {
    props: ['wallet'],
    methods: {
      detail(wallet) {
        this.$router.push({
          name: 'wallet-detail',
          address: wallet.address,
        });
      },
    },
  };
</script>

<style>
</style>
