<template>
  <v-card>
    <v-container fluid grid-list-lg>
      <v-layout row wrap>
        <vote-list-item :item="item" v-for="item in items"/>
      </v-layout>
    </v-container>
  </v-card>
</template>

<script>
  import VoteListItem from './VoteListItem';

  export default {
    name: 'wallet-vote-section',
    props: ['address'],
    components: {
      VoteListItem,
    },
    asyncComputed: {
      items() {
        return this.$store.getters.getProposals();
      },
    },
  };
</script>
