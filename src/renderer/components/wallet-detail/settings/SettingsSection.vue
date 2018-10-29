<template>
  <section class="SettingsSection">
    <div class="tabs">
      <ul>
        <li :class="{on: (menu === 'account')}" @click="menu = 'account'">{{$t('edit account')}}</li>
        <li :class="{on: (menu === 'recovery')}" @click="menu = 'recovery'">{{$t('confirm recovery key')}}</li>
        <li :class="{on: (menu === 'seed')}" @click="menu = 'seed'">{{$t('confirm secret seed')}}</li>
        <li :class="{on: (menu === 'delete')}" @click="menu = 'delete'">{{$t('delete membership')}}</li>
      </ul>
    </div>
    <div class="content">
      <component
          :is="settingsBodyContainer"
          :address="address"
          v-on:updateStatus="updateStatus"
      >
        <slot/>
      </component>
    </div>
  </section>
</template>

<script>
  import EditAccount from './EditAccount';
  import RecoveryKey from './RecoveryKey';

  export default {
    name: 'wallet-detail-settings',
    props: ['settingsMenu', 'address'],
    components: {
    },
    data() {
      return {
        menu: this.settingsMenu,
        settingsBodyContainer: this.getContainer(),
      };
    },
    computed: {
    },
    watch: {
      menu(name) {
        if (name === 'recovery') {
          this.settingsBodyContainer = RecoveryKey;
        } else if (name === 'seed') {
          this.settingsBodyContainer = EditAccount;
        } else if (name === 'delete') {
          this.settingsBodyContainer = EditAccount;
        }

        this.settingsBodyContainer = EditAccount;
      },
    },
    methods: {
      getContainer() {
        if (this.settingsMenu === 'recovery') {
          return RecoveryKey;
        } else if (this.settingsMenu === 'seed') {
          return EditAccount;
        } else if (this.settingsMenu === 'delete') {
          return EditAccount;
        }

        return EditAccount;
      },
      updateStatus() {
        this.$emit('updateStatus');
      },
    },
  };
</script>

<style>
  .SettingsSection {

  }

  .SettingsSection .tabs {
    height: 45px;
    padding: 0 20px;
    background-color: #fff;
  }

  .SettingsSection ul {
    list-style: none;
    padding: 0;
    height: 45px;
    display: flex;
  }

  .SettingsSection ul li {
    margin: 0 10px;
    font-size: 13px;
    color: #607481;
    height: 100%;
    display: flex;
    align-items: center;
    cursor: pointer;
    border-bottom: 2px solid #ffffff;
  }

  .SettingsSection ul li.on,
  .SettingsSection ul li:hover {
    color: #3c92e4;
    border-bottom: 2px solid #3c92e4;;
  }

  .SettingsSection .content {
    padding: 20px 30px;
  }
</style>
