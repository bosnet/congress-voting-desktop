<template>
  <div class="wallet__badge" v-show="wallet.verify">
  </div>
</template>

<script>
  export default {
    props: ['wallet'],
  };
</script>
