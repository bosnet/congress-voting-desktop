<template>
  <v-container class="WalletDetailPage" v-if="wallet != null">
    <sidebar :address="address"></sidebar>
    <div class="content">
      <component :is="walletChildContainer" :address="wallet.address">
        <slot/>
      </component>
      <v-card-actions>
        <v-btn @click="hide">remove</v-btn>
      </v-card-actions>
    </div>
  </v-container>
</template>

<script>
  import VoteSection from './wallet-detail/VoteSection';
  import FreezeAccountSection from './wallet-detail/FreezeAccountSection';
  import Sidebar from './wallet-detail/Sidebar';

  export default {
    name: 'wallet-detail-page',
    components: {
      Sidebar,
      VoteSection,
      FreezeAccountSection,
    },
    data() {
      return {
        address: {},
      };
    },
    methods: {
      hide() {
        this.$store.dispatch('deleteWalletByAddress', this.address)
          .then(() => {
            this.$router.push('/wallets');
          });
      },
    },
    computed: {
      walletChildContainer() {
        if (this.$route.hash === '#freezes') {
          return FreezeAccountSection;
        }
        return VoteSection;
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
    },
    mounted() {
      this.address = this.$route.params.address;
    },
  };
</script>

<style>
  .WalletDetailPage {
    margin: 0;
    padding: 0;
    height: 100%;
  }

  .WalletDetailPage .content {
    padding-left: 158px;
  }
</style>
