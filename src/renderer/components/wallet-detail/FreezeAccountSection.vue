<template>
  <div>
    <v-card>
      <v-container fluid grid-list-lg>
        <v-layout row wrap>
          <v-tabs>
            <v-tab>{{$t('frozen-account-list')}}</v-tab>
          </v-tabs>
          <v-card-actions>
            <v-btn @click="openFreezeDialog()">{{$t('freeze')}}</v-btn>
            <v-btn>{{$t('unfreeze')}}</v-btn>
          </v-card-actions>
          <v-card-text>
            <freeze-account-list-item :item="item" v-for="item in frozenAccounts"/>
          </v-card-text>
        </v-layout>
      </v-container>
    </v-card>
    <freeze-dialog ref="freezeDialog" :freeze="freeze"/>
  </div>
</template>

<script>
  import FreezeDialog from './FreezeDialog';
  import FreezeAccountListItem from './FreezeAccountListItem';

  export default {
    name: 'wallet-freeze-section',
    props: ['address'],
    components: {
      FreezeDialog,
      FreezeAccountListItem,
    },
    data() {
      return {
      };
    },
    methods: {
      freeze(amount, passphrase) {
        return this.$store.dispatch('freeze', { address: this.address, amount, passphrase })
          .then(() => this.loadOps());
      },
      unfreeze() {
      },
      loadOps() {
        return this.$store.dispatch('loadFrozenAccounts', this.address);
      },
      openFreezeDialog() {
        this.$refs.freezeDialog.open();
      },
    },
    mounted() {
      this.loadOps();
    },
    computed: {
      frozenAccounts() {
        return this.$store.state.RPC.frozenAccountOps;
      },
    },
  };
</script>
