<template>
  <div @click="detail()" class="WalletListItem">
    <span :class="['status', membershipStatus]">{{membershipStatusText}}</span>
    <div class="header">
      <h2>{{wallet.title}}</h2>
      <button class="line-button" @click.stop="copy(`#${wallet.address}`, 'addressCopied')">
        {{$t('copy public address')}}
        <span class="address" :id="wallet.address">{{wallet.address}}</span>
        <v-tooltip top v-model="addressCopied">
          <span>copied</span>
          <span slot="activator"></span>
        </v-tooltip>
      </button>
    </div>
    <div class="body">
      <div class="balance">{{ wallet.balance | bos }} <abbr>BOS</abbr></div>
      <div class="frozen" v-if="!!totalFrozenAmount">{{ totalFrozenAmount | bos }} <abbr>BOS</abbr></div>
    </div>
  </div>
</template>

<script>
  import Helper from '@/lib/helper';
  import { remote } from 'electron'; // eslint-disable-line

  const { Menu, MenuItem } = remote;

  export default {
    props: ['wallet', 'warn', 'notify', 'reload'],
    data() {
      return {
        addressCopied: false,
      };
    },
    computed: {
      membershipStatus() {
        if (this.wallet.membership) {
          this.notify(this.wallet.membership.status);
          return this.wallet.membership.status;
        }
        return '';
      },
      membershipStatusText() {
        if (this.membershipStatus === 'pending') {
          return this.$t('identity verification pending');
        } else if (this.membershipStatus === 'rejected') {
          return this.$t('identity verification failed');
        } else if (this.membershipStatus === 'verified') {
          return this.$t('PRE-MEMBERSHIP');
        } else if (this.membershipStatus === 'active') {
          return this.$t('MEMBERSHIP');
        }
        return '';
      },
      totalFrozenAmount() {
        if (this.$store.state.RPC.frozenAccountOps) {
          return this.$store.state.RPC.frozenAccountOps.reduce((accum, cur) => {
            if (cur.state !== 'returned') {
              return Helper.sumAmount(accum, cur.amount);
            }
            return accum;
          }, '0');
        }
        return null;
      },
    },
    methods: {
      detail() {
        if (parseInt(this.wallet.balance, 10) > 0) {
          this.$router.push(`/wallet/${this.wallet.address}/#account-frozen`);
        } else {
          this.warn('empty');
        }
      },
      copy(selector, tooltip) {
        const elem = document.querySelector(selector);
        Helper.copyToClipboard(elem);
        this.$data[tooltip] = true;
        setTimeout(() => {
          this.$data[tooltip] = false;
        }, 800);
      },
      async loadOps() {
        return this.$store.dispatch('loadFrozenAccounts', this.wallet.address);
      },
    },
    mounted() {
      this.loadOps();

      const self = this;
      const menu = new Menu();
      menu.append(new MenuItem({
        label: self.$t('deleting account'),
        async click() {
          await self.$store.dispatch('deleteWalletByAddress', self.wallet.address);
          if (self.reload) {
            if (self.membershipStatus) { self.notify(); }
            self.reload();
          }
        },
      }));

      this.$el.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        menu.popup({ window: remote.getCurrentWindow() });
      }, false);
    },
  };
</script>

<style>
  .WalletListItem {
    width: 550px;
    border-radius: 2px;
    background-color: #ffffff;
    margin: 0 auto 10px;
    padding: 30px;
    cursor: pointer;
    box-sizing: border-box;
    border: solid 2px #ffffff;
  }

  .WalletListItem:hover {
    box-shadow: 0 10px 25px 0 rgba(193, 217, 240, 0.87);
  }

  .WalletListItem:active {
    border: solid 2px #1993f1;
  }

  .WalletListItem .status {
    display: block;
    margin-bottom: -3px;
    font-size: 11px;
    font-weight: bold;
  }

  .WalletListItem .status.pending {
    color: #1792f0;
  }

  .WalletListItem .status.rejected {
    color: #ed6060;
  }

  .WalletListItem .status.verified {
    color: #50b37c;
  }

  .WalletListItem .status.active {
    color: #ef9e07;
  }

  .WalletListItem .header {
    width: 100%;
    display: flex;
    justify-content: space-between;
    padding-bottom: 20px;
    border-bottom: 1px solid #eceef0;
  }

  .WalletListItem .header h2 {
    width: 350px;
    font-size: 27px;
    font-weight: bold;
    color: #333333;
    display: inline-block;
  }

  .WalletListItem .header .line-button {
    display: inline-block;
    border-radius: 2px;
    border: solid 1px #7e919d;
    background-color: #ffffff;
    font-size: 10px;
    font-weight: bold;
    color: #7e919d;
    height: 30px;
    padding: 2px 8px;
    margin-top: 5px;
  }

  .WalletListItem .header .line-button:hover {
    border-color: #1289e5;
    color: #1289e5;
  }

  .WalletListItem .header .line-button:active {
    border-color: #1289e5;
    background-color: #1289e5;
    color: #ffffff;
  }

  .WalletListItem .header .address {
    position: absolute;
    left: -99999px;
  }

  .WalletListItem .body {
    padding-top: 35px;
    font-size: 19px;
    color: #333333;
  }

  .WalletListItem .body .balance,
  .WalletListItem .body .frozen {
    display: inline-block;
    position: relative;
    margin-right: 40px;
  }

  .WalletListItem .body .balance:before {
    content: "Balance";
  }

  .WalletListItem .body .frozen:before {
    content: "Frozen";
  }

  .WalletListItem .body .balance:before,
  .WalletListItem .body .frozen:before {
    font-size: 13px;
    font-weight: normal;
    color: #97a5b3;
    position: absolute;
    top: -15px;
    left: 0;
    font-size: 11px;
    color: #97a5b3;
  }

  .WalletListItem .body .balance abbr,
  .WalletListItem .body .frozen abbr {
    font-size: 10px;
    color: #909090;
    margin-left: -2px;
  }
</style>
