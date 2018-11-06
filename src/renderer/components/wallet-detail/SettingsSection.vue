<template>
  <section class="wallet-settings">
    <div class="settings-tabs">
      <ul class="settings-tabs-list">
        <li :class="tabClasses('account')" @click="$emit('tab', 'account')">{{$t('edit account')}}</li>
        <li :class="tabClasses('recovery')" @click="$emit('tab', 'recovery')">{{$t('confirm recovery key')}}</li>
        <li :class="tabClasses('seed')" @click="$emit('tab', 'seed')">{{$t('confirm secret seed')}}</li>
        <li :class="tabClasses('delete-membership')" @click="$emit('tab', 'delete-membership')" v-if="membershipState">
          {{$t('delete membership')}}
        </li>
      </ul>
    </div>
    <div class="settings-tabs-content">
      <bos-wallet-settings-secret-seed :wallet="wallet" v-if="active('seed')"/>
      <bos-wallet-settings-recovery-key :wallet="wallet" v-else-if="active('recovery')"/>
      <bos-wallet-settings-delete-membership :wallet="wallet" v-else-if="active('delete-membership')"/>
      <bos-wallet-settings-edit-account :wallet="wallet" v-else="active('account')"/>
    </div>
  </section>
</template>

<script>
  export default {
    name: 'bos-wallet-settings-section',
    props: ['activeMenu', 'wallet'],
    methods: {
      tabClasses(test) {
        return {
          'settings-tabs-list-item': true,
          'settings-tabs-list-item--on': this.active(test),
        };
      },
      active(test) {
        return this.activeMenu === test;
      },
    },
    computed: {
      membershipState() {
        return this.wallet && this.wallet.membership && this.wallet.membership.status;
      },
    },
  };
</script>

<style>
  .wallet-settings {
    height: 615px;
    overflow-y: auto;
  }

  .settings-tabs {
    height: 45px;
    padding: 0 20px;
    background-color: #fff;
  }

  .settings-tabs-list {
    list-style: none;
    padding: 0;
    height: 45px;
    display: flex;
  }

  .settings-tabs-list-item {
    margin: 0 10px;
    font-size: 13px;
    color: #607481;
    height: 100%;
    display: flex;
    align-items: center;
    cursor: pointer;
    border-bottom: 2px solid #ffffff;
  }

  .settings-tabs-list-item--on,
  .settings-tabs-list-item:hover {
    color: #3c92e4;
    border-bottom: 2px solid #3c92e4;;
  }

  .settings-tabs-content {
    padding: 20px 30px;
  }
</style>
