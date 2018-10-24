<template>
  <v-flex xs12>
    <v-card>
      <v-card-title primary-title>
        <div class="headline">{{ item.title }}</div>
        <div>{{ item.summary }}</div>
      </v-card-title>
      <v-card-actions>
        <v-btn flat color="primary">Detail</v-btn>
        <v-btn flat color="success" @click="answerProposal(item.id, 'yes')">Yes</v-btn>
        <v-btn flat color="red" @click="answerProposal(item.id, 'no')">No</v-btn>
        <v-btn flat color="red" @click="answerProposal(item.id, 'abs')">Abstention</v-btn>
      </v-card-actions>
    </v-card>
  </v-flex>
</template>

<script>
  import { mapActions } from 'vuex';

  export default {
    name: 'wallet-proposal-item',
    props: ['item'],
    methods: {
      ...mapActions([
        'answerProposal',
      ]),
    },
  };
</script>
