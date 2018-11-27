<template>
  <v-app>
    <v-content>
      <router-view/>
      <bos-toast v-model="toast">{{lastMessage}}</bos-toast>
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
        longTimer: null,
        toast: false,
        lastMessage: null,
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
      this.timer = setInterval(() => this.$root.$emit('tick'), 5000);
      this.longTimer = setInterval(() => this.$root.$emit('long-tick'), 600000); // 10 mins
      this.$root.$on('toast', (message) => {
        this.toast = true;
        this.lastMessage = message;
      });
    },
    destroyed() {
      clearInterval(this.timer);
      clearInterval(this.longTimer);
    },
  };
</script>

<style>
</style>
