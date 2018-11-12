<template>
  <div class="FrozenAccount">
    <div class="frozen-account-btns">
      <button class="btn" :disabled="willUnfreeze" @click="openFreezingDialog" v-if="isMembership">{{$t('freezing')}}</button>
      <button class="btn" :disabled="willUnfreeze" @click="prepareUnfreeze" v-if="hasFrozen">{{$t('unfreezing')}}</button>
      <!--<button class="btn" :disabled="false" @click="withdraw()">{{$t('')}}</button>-->
    </div>
    <div class="frozen-account-list">
      <ul>
        <bos-wallet-account-frozen-item
          ref="items"
          :item="item"
          :willUnfreeze="willUnfreeze"
          v-on:checked="addUnfreezeCandidate"
          v-for="item in accounts"/>
      </ul>
    </div>
    <transition name="unfreeze-action-bar-transition">
      <div class="unfreeze-action-bar" v-if="willUnfreeze">
        <span class="unfreeze-total">
          {{willUnfreezeAmount | bos}}<abbr>BOS ({{$t('fee')}} {{totalUnfreezeFeeAmount}} BOS)</abbr>
        </span>
        <div>
          <button class="btn" @click="unprepareUnfreeze">{{$t('cancel')}}</button>
          <button class="btn" @click="openUnfreezingDialog" v-if="willUnfreezeAccounts.length">{{$t('next')}}</button>
        </div>
      </div>
    </transition>
    <bos-freezing-dialog ref="freezingDialog" :wallet="wallet"/>
    <bos-unfreezing-dialog ref="unfreezingDialog" :wallet="wallet" :callback="unfreezingRequested"/>
  </div>
</template>

<script>
  import Helper from '@/lib/helper';

  export default {
    name: 'bos-wallet-account-frozen',
    props: ['activeMenu', 'wallet', 'frozenAccounts'],
    data() {
      return {
        willUnfreeze: false,
        willUnfreezeAccounts: [],
        willUnfreezeAmount: 0,
      };
    },
    methods: {
      prepareUnfreeze() {
        this.willUnfreeze = true;
      },
      unprepareUnfreeze() {
        this.willUnfreeze = false;
        this.$refs.items.forEach((i) => {
          i.checked = false;
        });
      },
      addUnfreezeCandidate() {
        this.willUnfreezeAccounts = this.$refs.items.filter((i) => {
          if (i.checked && i.item.state === 'frozen') {
            return true;
          }
          return false;
        });
        this.willUnfreezeAmount = this.willUnfreezeAccounts
          .reduce((accum, cur) => Helper.sumAmount(accum, cur.item.amount), '0');
      },
      // TODO: withdraw design is not ready
      withdraw() {
        const accounts = [];
        for (let i = 0; i < this.$refs.items.length; i += 1) {
          const ref = this.$refs.items[i];
          if (ref.checked) {
            accounts.push({
              address: ref.item.address,
              sequenceId: ref.item.sequence_id,
              amount: ref.item.amount,
            });
          }
        }
        this.$parent.promptPassphrase(`${accounts.length}개 회수`).then(({ passphrase }) =>
          accounts.map(account => this.$store.dispatch('withdraw', {
            address: this.address,
            frozenAccountAddress: account.address,
            sequenceId: account.sequenceId,
            passphrase,
          })));
      },
      openFreezingDialog() {
        this.$refs.freezingDialog.open();
      },
      openUnfreezingDialog() {
        const accounts = this.willUnfreezeAccounts.map(a => a.item);
        this.$refs.unfreezingDialog.open(accounts);
      },
      unfreezingRequested() {
        this.unprepareUnfreeze();
      },
    },
    computed: {
      accounts() {
        if (this.willUnfreeze) {
          return this.frozenAccounts.filter(a => a.state === 'frozen');
        }
        return this.frozenAccounts;
      },
      address() {
        return this.wallet.address;
      },
      totalUnfreezeFeeAmount() {
        return 0.001 * this.willUnfreezeAccounts.length;
      },
      isMembership() {
        return this.wallet && this.wallet.membership && this.wallet.membership.status === 'active';
      },
      hasFrozen() {
        return this.frozenAccounts && this.frozenAccounts.length > 0;
      },
    },
  };
</script>

<style>
  .FrozenAccount .frozen-account-btns {
    text-align: right;
    margin-bottom: 10px;
  }

  .FrozenAccount .btn {
    height: 34px;
    border-radius: 2px;
    border: solid 1px #b6c5d3;
    background-color: #ffffff;
    font-size: 13px;
    text-align: center;
    padding: 0 19px;
    color: #607481;
  }

  .FrozenAccount .btn:hover:enabled {
    border: solid 1px #1289e5;
    color: #3c92e4;
  }

  .FrozenAccount .btn:active:enabled {
    border: solid 1px #1289e5;
    background-color: #1289e5;
    color: #ffffff;
  }

  .FrozenAccount .btn:disabled {
    opacity: 0.5;
    border: solid 1px #b6c5d3;
    background-color: #ffffff;
    olor: #607481;
  }

  .FrozenAccount > ul  {
    list-style: none;
  }

  .FrozenAccount .unfreeze-action-bar {
    height: 54px;
    background-color: #3c92e4;
    position: fixed;
    bottom: 0;
    left: 158px;
    right: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 30px 10px 70px;
    font-size: 19px;
    font-weight: normal;
    color: #ffffff;
  }

  .FrozenAccount .unfreeze-action-bar .unfreeze-total {
    font-weight: bold;
  }

  .FrozenAccount .unfreeze-action-bar .unfreeze-total:before {
    content: "Total";
    font-weight: normal;
    margin-right: 21px;
  }

  .FrozenAccount .unfreeze-action-bar .unfreeze-total abbr {
    font-size: 12px;
    font-weight: normal;
    margin-left: 5px;
  }

  .FrozenAccount .unfreeze-action-bar .btn {
    border-radius: 2px;
    border: solid 1px #ffffff;
    font-size: 13px;
    font-weight: bold;
    color: #ffffff;
    background-color: #3c92e4;
  }

  .FrozenAccount .unfreeze-action-bar .btn:hover {
    box-shadow: 0 4px 6px 0 rgba(0, 0, 0, 0.15);
    background-color: #ffffff;
    color: #1289e5;
  }

  .FrozenAccount .unfreeze-action-bar .btn:active {
    background-color: #1866b0;
    color: #ffffff;
  }

  .unfreeze-action-bar-transition-enter-active {
    animation: unfreeze-action-bar-slide-in .2s;
  }
  .unfreeze-action-bar-transition-leave-active {
    animation: unfreeze-action-bar-slide-in .2s reverse;
  }

  @keyframes unfreeze-action-bar-slide-in {
    0% {
      transform: translateY(54px);
      opacity: 0;
    }
    100% {
      transform: translateY(0);
      opacity: 1;
    }
  }
</style>
