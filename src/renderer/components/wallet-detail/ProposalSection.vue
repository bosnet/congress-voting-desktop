<template>
  <div>
    <v-card v-if="state() === 'active'">
      <v-container fluid grid-list-lg>
        <v-layout row wrap>
          <bos-wallet-proposal-list-item
              :vote="openDialog"
              :item="item"
              v-for="item in items"/>
        </v-layout>
      </v-container>
      <vote-dialog ref="voteDialog" :callback="vote"/>
    </v-card>

    <bos-wallet-membership-pending-section :wallet="wallet" v-else-if="state() == 'pending'"/>
    <bos-wallet-membership-section :wallet="wallet" v-else-if="state() == 'verified'"/>
    <bos-wallet-pre-membership-section :wallet="wallet" v-else />
  </div>
</template>

<script>
  import VoteDialog from './VoteDialog';

  export default {
    name: 'bos-wallet-proposal-section',
    props: ['wallet'],
    components: {
      VoteDialog,
    },
    methods: {
      openDialog(proposal) {
        this.$refs.voteDialog.open(proposal);
      },
      state() {
        return this.wallet.membership && this.wallet.membership.status;
      },
      vote({ proposalId, answer, passphrase }) {
        return this.$store.dispatch('vote', {
          address: this.address,
          proposalId,
          answer,
          passphrase,
        });
      },
    },
    asyncComputed: {
      items() {
        return this.$store.getters.getProposals();
      },
    },
  };
</script>
