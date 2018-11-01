<template>
  <section class="SettingsSection">
    <div class="tabs">
      <ul>
        <li :class="{on: (activeMenu === 'account')}" @click="$emit('tab', 'account')">{{$t('edit account')}}</li>
        <li :class="{on: (activeMenu === 'recovery')}" @click="$emit('tab', 'recovery')">{{$t('confirm recovery key')}}</li>
        <li :class="{on: (activeMenu === 'seed')}" @click="$emit('tab', 'seed')">{{$t('confirm secret seed')}}</li>
        <li :class="{on: (activeMenu === 'delete-membership')}" @click="$emit('tab', 'delete-membership')">{{$t('delete membership')}}</li>
      </ul>
    </div>
    <div class="content">
      <component
          :is="settingsBodyContainer"
          :wallet="wallet"
      >
        <slot/>
      </component>
    </div>
  </section>
</template>

<script>
  import EditAccount from './EditAccount';
  import RecoveryKey from './RecoveryKey';
  import SecretSeed from './SecretSeed';
  import DeleteMembership from './DeleteMembership';

  export default {
    name: 'wallet-detail-settings',
    props: ['activeMenu', 'wallet'],
    computed: {
      settingsBodyContainer() {
        if (this.activeMenu === 'recovery') {
          return RecoveryKey;
        } else if (this.activeMenu === 'seed') {
          return SecretSeed;
        } else if (this.activeMenu === 'delete-membership') {
          return DeleteMembership;
        }
        return EditAccount;
      },
    },
  };
</script>

<style>
  .SettingsSection {
    height: 615px;
    overflow-y: auto;
  }

  .SettingsSection .tabs {
    height: 45px;
    padding: 0 20px;
    background-color: #fff;
  }

  .SettingsSection .tabs ul {
    list-style: none;
    padding: 0;
    height: 45px;
    display: flex;
  }

  .SettingsSection .tabs ul li {
    margin: 0 10px;
    font-size: 13px;
    color: #607481;
    height: 100%;
    display: flex;
    align-items: center;
    cursor: pointer;
    border-bottom: 2px solid #ffffff;
  }

  .SettingsSection .tabs ul li.on,
  .SettingsSection .tabs ul li:hover {
    color: #3c92e4;
    border-bottom: 2px solid #3c92e4;;
  }

  .SettingsSection .content {
    padding: 20px 30px;
  }
</style>
