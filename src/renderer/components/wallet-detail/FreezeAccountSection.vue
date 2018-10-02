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
  import { remoteRPC } from '@/lib/rpc';
  import wallet from '@/lib/wallet';
  import { createFreezeAccountTx } from '@/lib/frames';
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
        return Promise.all([
          remoteRPC.getAccount(this.address),
          this.$store.getters.getWallet(this.address),
        ]).then((res) => {
          const seed = wallet.decryptWallet(passphrase, res[1].data);
          const seqId = res[0].sequenceid;
          const account = wallet.createFreezeAccount(seed, seqId);
          const tx = createFreezeAccountTx(
            this.address,
            amount * 10000000,
            seqId,
            account.publicKey(),
          );

          wallet.hash(tx.nestedArrays()).then((hash) => {
            tx.updateSignature(wallet.sign(seed, hash));
            this.$store.dispatch('sendTx', tx.json());
          });
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
