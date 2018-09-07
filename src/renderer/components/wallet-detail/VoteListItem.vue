<template>
  <v-flex xs4>
    <v-card>
      <v-card-title primary-title>
        <div class="headline">{{ item.title }}</div>
        <div>{{ item.summary }}</div>
      </v-card-title>
      <v-card-actions>
        <v-btn flat color="primary">Detail</v-btn>
      </v-card-actions>
    </v-card>
  </v-flex>
</template>

<script>
  export default {
    name: 'wallet-vote-item',
    props: ['item'],
  };
</script>
