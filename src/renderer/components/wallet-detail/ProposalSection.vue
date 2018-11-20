<template>
  <div>
    <bos-wallet-proposal-list :wallet="wallet" v-if="state === 'active'"/>
    <!--<v-card v-if="state === 'active'">-->
      <!--<v-container fluid grid-list-lg>-->
        <!--<v-layout row wrap>-->
          <!--<bos-wallet-proposal-item-->
              <!--:vote="openDialog"-->
              <!--:item="item"-->
              <!--v-for="item in items"/>-->
        <!--</v-layout>-->
      <!--</v-container>-->
      <!--<vote-dialog ref="voteDialog" :callback="vote"/>-->
    <!--</v-card>-->

    <bos-wallet-membership-pending-section :wallet="wallet" v-else-if="state == 'pending'"/>
    <bos-wallet-membership-section :wallet="wallet" v-else-if="state == 'verified'"/>
    <bos-wallet-pre-membership-section :wallet="wallet" v-else />
  </div>
</template>

<script>
  export default {
    name: 'bos-wallet-proposal-section',
    props: ['wallet'],
    computed: {
      state() {
        return this.wallet.membership && this.wallet.membership.status;
      },
    },
  };
</script>
