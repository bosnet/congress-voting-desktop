<template>
  <v-app>
    <v-content>
      <router-view/>
    </v-content>
  </v-app>
</template>

<script>
  export default {
    name: 'drawer-layout',
    computed: {
      requestErrors() {
        return this.$store.state.Layout.requestErrors;
      },
    },
  };
</script>

<style>
</style>
