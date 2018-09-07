<template>
  <v-flex xs12>
    <v-layout row wrap>
      <v-flex xs12>
        <v-text-field label="Secret Seed" ref="secretSeed"/>
      </v-flex>
    </v-layout>
  </v-flex>
</template>

<script>
  export default {
    name: 'wallet-import-secret-seed',
    methods: {
      seed() {
        return this.$refs.secretSeed.inputValue;
      },
    },
  };
</script>
