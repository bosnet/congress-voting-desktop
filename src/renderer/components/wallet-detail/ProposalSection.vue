<template>
  <v-card>
    <v-container fluid grid-list-lg>
      <v-layout row wrap>
        <proposal-list-item :item="item" v-for="item in items"/>
      </v-layout>
    </v-container>
  </v-card>
</template>

<script>
  import ProposalListItem from './ProposalListItem';

  export default {
    name: 'wallet-proposal-section',
    props: ['address'],
    components: {
      ProposalListItem,
    },
    asyncComputed: {
      items() {
        return this.$store.getters.getProposals();
      },
    },
  };
</script>
