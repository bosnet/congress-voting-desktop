<template>
  <v-flex xs12>
    <v-list subheader three-line>
      <v-list-tile>
        <v-list-tile-action>
          <v-checkbox v-model="item.checked" />
        </v-list-tile-action>

        <v-list-tile-content>
          <v-list-tile-title>{{ item.target }}</v-list-tile-title>
          <v-list-tile-sub-title>{{ item.amount | bos }}</v-list-tile-sub-title>
        </v-list-tile-content>
      </v-list-tile>
    </v-list>

    <v-divider></v-divider>
  </v-flex>
</template>

<script>
  export default {
    name: 'wallet-freeze-item',
    props: ['item'],
  };
</script>
