<template>
  <div class="WalletList">
    <h1>{{$t('available accounts')}}</h1>
    <wallet-list-item
        v-if="wallets.length > 0"
        :wallet="wallet"
        :warn="warn"
        :notify="notify"
        :reload="reload"
        v-for="wallet in wallets"
    />
    <bos-toast v-model="showEmptyAccountWarning">
      {{$t('To create your account, depositing over 0.1 BOS')}}
    </bos-toast>
  </div>
</template>

<script>
  import WalletListItem from './WalletListItem';

  export default {
    props: ['wallets', 'notify', 'reload'],
    components: { WalletListItem },
    data() {
      return {
        showEmptyAccountWarning: false,
      };
    },
    methods: {
      warn(type) {
        if (type === 'empty') {
          this.showEmptyAccountWarning = true;
        }
      },
    },
  };
</script>

<style>
  .WalletList h1 {
    font-size: 16px;
    font-weight: bold;
    color: #869aae;
    text-align: center;
    margin-bottom: 20px;
  }
</style>
