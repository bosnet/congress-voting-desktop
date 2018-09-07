<template>
  <v-container fluid grid-list-sm>
    <wallet-list :wallets="wallets"/>
    <v-layout row wrap>
      <v-flex xs12 v-show="wallets.length == 0">
        <div>{{$t('no-found-wallets')}}</div>
      </v-flex>
      <v-flex xs12>
        <v-bottom-sheet v-model="sheet" full-width>
          <v-btn slot="activator" block large><v-icon>add</v-icon></v-btn>
          <v-list>
            <v-subheader>{{$t('import-wallet')}}</v-subheader>
            <v-list-tile
                v-for="tile in tiles"
                :key="tile.title"
                :to="tile.to"
                @click="sheet = false"
            >
              <v-btn icon><v-icon>{{ tile.icon }}</v-icon></v-btn>
              <v-list-tile-title>{{ tile.title }}</v-list-tile-title>
            </v-list-tile>
          </v-list>
        </v-bottom-sheet>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import WalletList from './wallet-list/WalletList';

  export default {
    name: 'wallet-list-page',
    components: {
      WalletList,
    },
    mounted() {
      this.$store.dispatch('loadWallets');
      this.$store.dispatch('clearSideLinks');
    },
    computed: {
      wallets() {
        return this.$store.state.Wallet.wallets;
      },
    },
    data() {
      return {
        sheet: false,
        tiles: [
          { icon: 'security', title: this.$t('import-secret-seed'), to: '/wallets/new?source=secret-seed' },
          { icon: 'https', title: this.$t('import-recovery-key'), to: '/wallets/new?source=recovery-key' },
        ],
      };
    },
  };
</script>

<style>
</style>
