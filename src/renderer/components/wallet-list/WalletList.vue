<template>
  <div class="WalletList">
    <h1>{{$t('available accounts')}}</h1>
    <wallet-list-item
        v-if="wallets.length > 0"
        :wallet="wallet"
        :warn="warn"
        :notify="notify"
        v-for="wallet in wallets"
    />
    <transition name="wallet-list-warn-slide">
      <div class="toast" v-show="showEmptyAccountWarning">
        <span class="warn">{{$t('To create your account, depositing over 1 BOS')}}</span>
      </div>
    </transition>
  </div>
</template>

<script>
  import WalletListItem from './WalletListItem';

  export default {
    props: ['wallets', 'notify'],
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
          setTimeout(() => {
            this.showEmptyAccountWarning = false;
          }, 2000);
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

  .WalletList .toast {
    position: fixed;
    bottom: 47px;
    left: 0;
    width: 100%;
    text-align: center;
  }

  .WalletList .warn {
    height: 30px;
    display: inline-block;
    border-radius: 15px;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.34);
    background-color: #353a3f;
    padding: 5px 30px;
    font-size: 13px;
    color: #ffffff;
  }

  .wallet-list-warn-slide-enter-active {
    animation: wallet-list-warn-slide-in .2s;
  }
  .wallet-list-warn-slide-leave-active {
    animation: wallet-list-warn-slide-in .2s reverse;
  }
  @keyframes wallet-list-warn-slide-in {
    0% {
      transform: translateY(30px);
      opacity: 0;
    }
    100% {
      transform: translateY(0);
      opacity: 1;
    }
  }
</style>
