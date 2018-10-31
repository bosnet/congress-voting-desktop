<template>
  <v-flex xs12>
    <v-list subheader three-line>
      <v-list-tile>
        <v-list-tile-action>
          <v-checkbox v-model="checked" :disabled="!valid"/>
        </v-list-tile-action>

        <v-list-tile-content>
          <v-list-tile-title>{{ item.address }}</v-list-tile-title>
          <v-list-tile-sub-title>{{ item.amount | bos }} {{ item.state }} {{ item.sequence_id }}</v-list-tile-sub-title>
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
    data() {
      return {
        checked: false,
      };
    },
    computed: {
      valid() {
        return this.item.state === 'frozen' || this.item.state === 'unfrozen';
      },
    },
  };
</script>
