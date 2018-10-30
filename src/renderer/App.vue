<template>
  <component :is="component">
    <slot/>
  </component>
</template>

<script>
  import AppLayout from '@/layout/AppLayout';

  export default {
    name: 'boscoin-wallet',
    components: {
      AppLayout,
    },
    computed: {
      component() {
        return AppLayout;
      },
    },
  };
</script>

<style>
</style>
