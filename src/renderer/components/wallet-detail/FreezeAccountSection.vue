<template>
  <div>
    <v-card>
      <v-container fluid grid-list-lg>
        <v-layout row wrap>
          <v-tabs>
            <v-tab>{{$t('frozen-account-list')}}</v-tab>
            <v-tab>{{$t('frozen-account-history-list')}}</v-tab>
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
  import wallet from '@/lib/wallet';
  import { instance as sebak } from '@/lib/sebak';
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
        Promise.all([
          sebak.getAccount(this.address),
          this.$store.getters.getWallet(this.address),
        ]).then((res) => {
          const seed = wallet.decryptWallet(passphrase, res[1].data);
          const account = wallet.createFreezeAccount(seed, res[0].sequenceid);
          // TODO : sign & send tx
          const payload = [
            this.address, // source
            0, // fee
            res[0].sequenceid, // sequence id
            [
              ['create-account'],
              [
                account.publicKey(), // target
                amount, // amount
                this.address, // linked
              ],
            ],
          ];
          sebak.sign(payload);
          // this.$store.dispatch('createAccount', { ... });
        });
      },
      openFreezeDialog() {
        this.$refs.freezeDialog.open();
      },
    },
    asyncComputed: {
      frozenAccounts() {
        return this.$store.getters.frozenAccounts(this.address);
      },
    },
  };
</script>
