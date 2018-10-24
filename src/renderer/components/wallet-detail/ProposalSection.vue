<template>
  <v-card>
    <v-container fluid grid-list-lg>
      <v-layout row wrap>
        <proposal-list-item :item="item" :vote="openDialog" v-for="item in items"/>
      </v-layout>
    </v-container>
    <vote-dialog ref="voteDialog" :callback="vote"/>
  </v-card>
</template>

<script>
  import VoteDialog from './VoteDialog';
  import ProposalListItem from './ProposalListItem';

  export default {
    name: 'wallet-proposal-section',
    props: ['address'],
    components: {
      VoteDialog,
      ProposalListItem,
    },
    methods: {
      openDialog(proposal) {
        this.$refs.voteDialog.open(proposal);
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
