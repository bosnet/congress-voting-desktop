<template>
  <div>
    <bos-wallet-proposal-list :wallet="wallet" v-if="state === 'active'"/>
    <bos-wallet-membership-pending-section :wallet="wallet" v-else-if="state == 'pending'"/>
    <bos-wallet-membership-section :wallet="wallet" v-else-if="state == 'verified'"/>
    <bos-wallet-pre-membership-section :wallet="wallet" v-else />
  </div>
</template>

<script>
  export default {
    name: 'bos-wallet-proposal-section',
    props: ['wallet'],
    computed: {
      state() {
        return this.wallet.membership && this.wallet.membership.status;
      },
    },
  };
</script>
