<template>
  <section class="Account">
    <header class="account-header">
      <div class="balance">{{ account.balance | bos }} <abbr>BOS</abbr></div>
      <div class="frozen" v-if="!!totalFrozenAmount">{{ totalFrozenAmount | bos }} <abbr>BOS</abbr></div>
    </header>
    <div class="account-tabs">
      <ul class="account-tabs-list">
        <li :class="tabClasses('frozen')" @click="$emit('tab', 'frozen')">{{$t('frozen account')}}</li>
      </ul>
    </div>
    <div class="account-tabs-content">
      <bos-wallet-account-frozen :wallet="wallet" :frozenAccounts="frozenAccounts" v-if="active('frozen')"/>
    </div>
  </section>
</template>

<script>
  import Helper from '@/lib/helper';

  export default {
    name: 'bos-wallet-account-section',
    props: ['activeMenu', 'wallet'],
    data() {
      return {
        account: {},
      };
    },
    methods: {
      async loadOps() {
        return this.$store.dispatch('loadFrozenAccounts', this.address);
      },
      tick() {
        this.loadOps();
        this.loadAccount();
      },
      tabClasses(test) {
        return {
          'account-tabs-list-item': true,
          'account-tabs-list-item--on': this.active(test),
        };
      },
      active(test) {
        return this.activeMenu === test;
      },
      async loadAccount() {
        this.account = await this.$store.getters.account(this.address);
      },
    },
    mounted() {
      this.$store.state.App.ga.send('screenview', { cd: 'bos-wallet-account-section' });
      this.$root.$on('tick', this.tick);
      this.$store.dispatch('clearFrozenAccounts');
      this.loadOps();
      this.loadAccount();
    },
    destroyed() {
      this.$root.$off('tick', this.tick);
    },
    computed: {
      address() {
        return this.wallet.address;
      },
      frozenAccounts() {
        if (this.$store.state.RPC.frozenAccountOps) {
          return this.$store.state.RPC.frozenAccountOps.filter(a => a.state !== 'returned');
        }
        return [];
      },
      totalFrozenAmount() {
        if (this.frozenAccounts) {
          return this.frozenAccounts.reduce((accum, cur) => {
            if (cur.state !== 'returned') {
              return Helper.sumAmount(accum, cur.amount);
            }
            return accum;
          }, '0');
        }
        return null;
      },
    },
  };
</script>

<style>
  .Account .account-header  {
    background-color: #fff;
    height: 158px;
    padding: 67px 30px 0;
    font-size: 28px;
    font-weight: bold;
    color: #333333;
  }

  .Account .account-header .balance {
    display: inline-block;
    position: relative;
    width: 337px;
  }

  .Account .account-header .frozen {
    display: inline-block;
    position: relative;
  }

  .Account .account-header .balance:before {
    content: "Balance";
  }

  .Account .account-header .frozen:before {
    content: "Frozen";
  }

  .Account .account-header .balance:before,
  .Account .account-header .frozen:before {
    font-size: 13px;
    font-weight: normal;
    color: #97a5b3;
    position: absolute;
    top: -15px;
    left: 0;
  }

  .Account .account-header .balance abbr,
  .Account .account-header .frozen abbr {
    font-size: 17px;
    font-weight: normal;
    color: #909090;
    margin-left: -5px;
  }

  .Account .account-tabs {
    height: 45px;
    padding: 0 20px;
    background-color: #fff;
  }

  .Account .account-tabs-list {
    list-style: none;
    padding: 0;
    height: 45px;
    display: flex;
  }

  .Account .account-tabs-list-item {
    margin: 0 10px;
    font-size: 13px;
    color: #607481;
    height: 100%;
    display: flex;
    align-items: center;
    cursor: pointer;
    border-bottom: 2px solid #ffffff;
  }

  .Account .account-tabs-list-item:hover {
    color: #3c92e4;
  }

  .Account .account-tabs-list-item--on {
    color: #3c92e4;
    border-bottom: 2px solid #3c92e4;
  }

  .Account .account-tabs-content {
    padding: 10px 30px;
    background-color: #eaeff5;
    height: 412px;
    overflow-y: auto;
  }
</style>
