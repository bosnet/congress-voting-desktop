<template>
  <li class="frozen-item" @click="check">
    <span class="action">
      <input type="checkbox" :value="item.address" v-model="checked" v-if="willUnfreeze"/>
      <img :src="frozenIcon" v-else/>
    </span>
    <span class="body">
      <span class="state">
        <span :class="`state-${item.state}`" v-if="item.state === 'unfrozen'">{{$t('possible to withdraw')}}</span>
        <!-- TODO: show unfreezing d-day -->
        <span :class="`state-${item.state}`" v-else-if="item.state === 'melting'">{{$t('unfreezed until')}} {{remainingTime}}</span>
      </span>
      <span class="addr">{{ item.address | short }}</span>
      <span class="created">{{ item.create_block_height }} block</span>
    </span>
    <span class="balance">
      <span>{{ item.amount | bos }}<abbr>BOS</abbr></span>
      <span v-if="item.state === 'unfrozen'">
        <button class="withdraw" @click="openUnfreezingWithdrawDialog">{{$t('withdrawing')}}</button>
        <bos-unfreezing-withdraw-dialog ref="unfreezingWithdrawDialog" :frozenAccount="item" :generalAccount="wallet"/>
      </span>
    </span>
  </li>
</template>

<script>
  import frozenIcon from '../../assets/svg/account-frozen.svg';

  export default {
    name: 'bos-wallet-account-frozen-account-item',
    props: ['item', 'wallet', 'willUnfreeze'],
    data() {
      return {
        frozenIcon,
        checked: false,
      };
    },
    watch: {
      checked() {
        this.$emit('checked');
      },
    },
    methods: {
      active(item, test) {
        return item.state === test;
      },
      check() {
        if (this.willUnfreeze) {
          this.checked = !this.checked;
        }
      },
      openUnfreezingWithdrawDialog() {
        this.$refs.unfreezingWithdrawDialog.open();
      },
    },
    computed: {
      valid() {
        return this.item.state === 'frozen' || this.item.state === 'unfrozen';
      },
      remainingTime() {
        // (blocks * 5 secs) / (24 hours * 60 minutes * 60 seconds)
        const blockToSecs = this.item.unfreezing_remaining_blocks * 5;
        const remainingDays = blockToSecs / (24 * 60 * 60);
        if (remainingDays > 1) {
          return `D-${Math.floor(remainingDays)}`;
        }

        return `${this.$t('remaining', { hours: Math.floor(blockToSecs / (60 * 60)) })}`;
      },
    },
  };
</script>

<style>
  .frozen-item {
    display: block;
    height: 100px;
    border-radius: 2px;
    background-color: #ffffff;
    margin-bottom: 5px;
    position: relative;
  }

  .frozen-item .action {
    width: 96px;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    float: left;
  }

  .frozen-item .action:after {
    content: "";
    display: inline-block;
    width: 1px;
    height: 44px;
    background-color: #eceef0;
    position: absolute;
    top: 28px;
    right: 0;
  }

  .frozen-item .body {
    width: 300px;
    height: 100%;
    display: flex;
    justify-content: center;
    flex-direction: column;
    font-size: 15px;
    color: #333333;
    float: left;
    padding: 0 30px;
  }

  .frozen-item .body .state .state-unfrozen {
    display: inline-block;
    border-radius: 2px;
    background-color: #e3f0f6;
    font-size: 11px;
    font-weight: bold;
    color: #207ed7;
    padding: 1px 6px;
    margin-bottom: 4px;
  }

  .frozen-item .body .state .state-melting {
    display: inline-block;
    border-radius: 2px;
    background-color: #f7e9e7;
    font-size: 11px;
    font-weight: bold;
    color: #b44c4c;
  }

  .frozen-item .body .addr {
    display: block;
    width: 100%;
  }

  .frozen-item .body .created {
    display: block;
    width: 100%;
    font-size: 11px;
    color: #909090;
    margin-top: -5px
  }

  .frozen-item .balance {
    float: right;
    display: flex;
    justify-content: center;
    flex-direction: column;
    height: 100%;
    font-size: 16px;
    font-weight: bold;
    color: #333333;
    text-align: right;
    padding-right: 30px;
  }

  .frozen-item .balance abbr {
    font-size: 10px;
    font-weight: normal;
    color: #909090;
    margin-left: 3px;
  }

  .frozen-item .balance .withdraw {
    font-size: 13px;
    font-style: normal;
    color: #3c92e4;
    cursor: pointer;
    text-decoration: underline;
    text-align: right;
  }
</style>
