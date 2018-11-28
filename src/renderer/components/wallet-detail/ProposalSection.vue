<template>
  <div>
    <bos-wallet-proposal-list :wallet="wallet" v-if="state() === 'active'"/>
    <bos-wallet-membership-pending-section :wallet="wallet" v-else-if="state() == 'pending'"/>
    <bos-wallet-membership-section :wallet="wallet" v-on:done="activate" v-else-if="state() == 'verified'"/>
    <bos-wallet-pre-membership-section :wallet="wallet" v-else />
  </div>
</template>

<script>
  export default {
    name: 'bos-wallet-proposal-section',
    props: ['wallet'],
    data() {
      return {
        previousState: null,
      };
    },
    methods: {
      state() {
        if (this.wallet.membership && this.wallet.membership.status) {
          if (this.previousState === 'verified') {
            return this.previousState;
          }

          this.previousState = this.wallet.membership.status;
          return this.wallet.membership.status;
        }
        return false;
      },
      activate() {
        this.previousState = null;
        this.state();
      },
    },
    mounted() {
      this.$store.state.App.ga.send('screenview', { cd: 'bos-wallet-proposal-section' });
    },
  };
</script>
