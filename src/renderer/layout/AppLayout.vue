<template>
  <v-app>
    <v-content>
      <router-view/>
    </v-content>
  </v-app>
</template>

<script>
  export default {
    name: 'root',
    components: {
    },
    data() {
      return {
        timer: null,
      };
    },
    methods: {
    },
    computed: {
      errors() {
        return this.$store.state.App.errors;
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
