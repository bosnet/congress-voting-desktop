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
    data() {
      return {
        timer: null,
      };
    },
    computed: {
      requestErrors() {
        return this.$store.state.Layout.requestErrors;
      },
    },
    created() {
      this.timer = setInterval(() => this.$root.$emit('tick'), 10000);
    },
    destroyed() {
      clearInterval(this.timer);
    },
  };
</script>

<style>
</style>
