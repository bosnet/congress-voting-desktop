<template>
  <component :is="component">
    <slot/>
  </component>
</template>

<script>
  import DrawerLayout from '@/components/layout/DrawerLayout';

  export default {
    name: 'boscoin-wallet',
    data: () => ({
      title: null,
    }),
    components: {
      DrawerLayout,
    },
    mounted() {
      this.title = this.$route.name;
    },
    computed: {
      component() {
        return DrawerLayout;
      },
    },
    watch: {
      $route() {
        this.title = this.$route.name;
      },
    },
  };
</script>

<style>
</style>
