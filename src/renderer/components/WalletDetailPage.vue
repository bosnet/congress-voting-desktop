<template>
  <v-layout row v-if="wallet != null">
    <v-flex xs12>
      <v-layout row wrap>
        <v-flex xs12>
          <v-card>
            <v-card-title class="subheading font-weight-bold" primary-title>
              <div>
                <h2 class="headline mb-0">{{ wallet.title }}</h2>
                <div>{{ wallet.address }}</div>
              </div>
            </v-card-title>
            <v-card-actions>
              <v-btn @click="hide">remove</v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>
      <component :is="walletChildContainer" :address="wallet.address">
        <slot/>
      </component>
    </v-flex>
  </v-layout>
</template>

<script>
  import VoteSection from './wallet-detail/VoteSection';
  import FreezeAccountSection from './wallet-detail/FreezeAccountSection';

  export default {
    name: 'wallet-detail-page',
    components: {
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
      this.$store.dispatch('updateSideLinks', [
        { icon: 'list', link: `/wallet/${this.address}/#votes`, title: this.$t('vote-list') },
        { icon: 'folder', link: `/wallet/${this.address}/#freezes`, title: this.$t('freeze-list') },
      ]);
    },
  };
</script>
