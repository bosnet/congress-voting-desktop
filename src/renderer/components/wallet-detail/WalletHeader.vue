<template>
  <header class="wallet-header">
    <h1 class="wallet-header-title">{{title}}</h1>
    <div class="wallet-header-account-info">
      {{ wallet.title }}
      <span :class="classes" v-if="state !== 'none'">{{label}}</span>
    </div>
  </header>
</template>

<script>
  export default {
    name: 'bos-wallet-header',
    props: ['wallet', 'title'],
    data() {
      return {
        labels: {
          pending: this.$t('identity verification pending'),
          rejected: this.$t('identity verification failed'),
          verified: this.$t('PRE-MEMBERSHIP'),
          active: this.$t('MEMBERSHIP'),
          none: '',
        },
      };
    },
    computed: {
      classes() {
        return {
          'wallet-membership-state': true,
          'wallet-membership-state--pending': this.state === 'pending',
          'wallet-membership-state--rejected': this.state === 'rejected',
          'wallet-membership-state--verified': this.state === 'verified',
          'wallet-membership-state--active': this.state === 'active',
        };
      },
      state() {
        if (this.wallet && this.wallet.membership && this.labels[this.wallet.membership.status]) {
          return this.wallet.membership.status;
        }
        return 'none';
      },
      label() {
        return this.labels[this.state];
      },
    },
  };
</script>

<style>
  .wallet-header {
    background-color: #fff;
    height: 60px;
    border-bottom: 1px solid #f1f2f3;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .wallet-header-title {
    font-size: 20px;
    font-weight: bold;
    color: #394878;
    margin-left: 30px;
  }

  .wallet-header-account-info {
    font-size: 13px;
    color: #333333;
    margin-right: 30px;
  }

  .wallet-membership-state {
    display: inline-block;
    margin-bottom: -3px;
    font-size: 11px;
    font-weight: bold;
    padding: 1px 5px;
    margin-left: 6px;
    border-radius: 2px;
  }

  .wallet-membership-state--pending {
    color: #1792f0;
    border: 1px solid #1792f0;
  }

  .wallet-membership-state--rejected {
    color: #ed6060;
    border: 1px solid #ed6060;
  }

  .wallet-membership-state--verified {
    color: #50b37c;
    border: 1px solid #50b37c;
  }

  .wallet-membership-state--active {
    color: #ef9e07;
    border: 1px solid #ef9e07;
  }
</style>
