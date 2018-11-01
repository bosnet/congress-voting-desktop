<template>
  <v-container class="WalletDetailPage" v-if="wallet != null">
    <sidebar
        :address="address"
        :membershipStatus="membershipStatus"
        :activeMenu="activeMenu"
    ></sidebar>
    <div class="content">
      <header>
        <h1>{{title}}</h1>
        <div class="account-info">
          {{ wallet.title }}
          <span :class="['status', membershipStatus]">{{membershipStatusText}}</span>
        </div>
      </header>
      <component
          :is="walletChildContainer"
          :address="wallet.address"
          :settingsMenu="settingsMenu"
          v-on:updateStatus="updateStatus"
      >
        <slot/>
      </component>
    </div>
    <bos-passphrase-dialog ref="passphraseDialog"/>
  </v-container>
</template>

<script>
  import ProposalSection from './wallet-detail/ProposalSection';
  import PreMembershipSection from './wallet-detail/PreMembershipSection';
  import AccountSection from './wallet-detail/AccountSection';
  import Sidebar from './wallet-detail/Sidebar';
  import SettingsSection from './wallet-detail/settings/SettingsSection';

  export default {
    name: 'wallet-detail-page',
    components: {
      Sidebar,
      ProposalSection,
      AccountSection,
    },
    data() {
      return {
        title: '',
        address: {},
        activeMenu: '',
        settingsMenu: '',
      };
    },
    methods: {
      async updateStatus() {
        const w = await this.$store.getters.getWallet(this.address);
        this.$data.wallet = w;
      },
      promptPassphrase(title, options) {
        return new Promise((resolve => this.$refs.passphraseDialog.open({
          title,
          options,
          confirmCallback: resolve,
        })));
      },
    },
    computed: {
      walletChildContainer() {
        if (this.$route.hash === '#voting') {
          this.title = 'Congress Voting';
          this.activeMenu = 'voting';
          if (this.membershipStatus === 'active') {
            return ProposalSection;
          }
          return PreMembershipSection;
        } else if (this.$route.hash === '#settings-account') {
          this.title = 'Settings';
          this.activeMenu = 'settings';
          this.settingsMenu = 'account';
          return SettingsSection;
        } else if (this.$route.hash === '#settings-recovery') {
          this.title = 'Settings';
          this.activeMenu = 'settings';
          this.settingsMenu = 'recovery';
          return SettingsSection;
        } else if (this.$route.hash === '#settings-seed') {
          this.title = 'Settings';
          this.activeMenu = 'settings';
          this.settingsMenu = 'seed';
          return SettingsSection;
        } else if (this.$route.hash === '#settings-membership') {
          this.title = 'Settings';
          this.activeMenu = 'settings';
          this.settingsMenu = 'delete';
          return SettingsSection;
        }

        this.title = 'Account';
        this.activeMenu = 'account';
        return AccountSection;
      },
      membershipStatus() {
        if (this.membership) {
          return this.membership.status;
        }
        return '';
      },
      membershipStatusText() {
        if (this.membershipStatus === 'pending') {
          return this.$t('identity verification pending');
        } else if (this.membershipStatus === 'rejected') {
          return this.$t('identity verification failed');
        } else if (this.membershipStatus === 'verified') {
          return this.$t('PRE-MEMBERSHIP');
        } else if (this.membershipStatus === 'active') {
          return this.$t('MEMBERSHIP');
        }
        return '';
      },
    },
    asyncComputed: {
      wallet() {
        if (this.address != null) {
          return this.$store.getters.getWallet(this.address);
        }
        this.$router.push('/wallets');
        return null;
      },
      membership() {
        if (this.address != null && !(this.address instanceof Object)) {
          return this.$store.getters.getMembership(this.address);
        }
        return null;
      },
    },
    mounted() {
      this.address = this.$route.params.address;
    },
  };
</script>

<style>
  .WalletDetailPage.container {
    margin: 0;
    padding: 0;
    height: 100%;
    width: 100%;
    max-width: none;
  }

  .WalletDetailPage .content {
    padding-left: 158px;
  }

  .WalletDetailPage .content header {
    background-color: #fff;
    height: 60px;
    border-bottom: 1px solid #f1f2f3;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .WalletDetailPage .content header h1 {
    font-size: 20px;
    font-weight: bold;
    color: #394878;
    margin-left: 30px;
  }

  .WalletDetailPage .content header .account-info {
    font-size: 13px;
    color: #333333;
    margin-right: 12px;
  }

  .WalletDetailPage .content header .account-info .status {
    display: inline-block;
    margin-bottom: -3px;
    font-size: 11px;
    font-weight: bold;
    padding: 0 5px;
  }

  .WalletDetailPage .content header .account-info .status.pending {
    color: #1792f0;
  }

  .WalletDetailPage .content header .account-info .status.rejected {
    color: #ed6060;
  }

  .WalletDetailPage .content header .account-info .status.verified {
    color: #50b37c;
    border-radius: 2px;
    border: 1px solid #50b37c;
  }

  .WalletDetailPage .content header .account-info .status.active {
    color: #ef9e07;
    border-radius: 2px;
    border: 1px solid #ef9e07;
  }
</style>
