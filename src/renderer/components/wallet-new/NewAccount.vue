<template>
  <div class="NewAccount">
    <h1>{{$t('creating new account')}}</h1>
    <h4>{{$t('please keep your secret seed safely')}}</h4>
    <div class="content">
      <div class="account">
        <span class="label">{{$t('public address')}}</span>
        <span class="value" id="address">{{address}}</span>

        <div class="copy" @click="copy('#address', 'addressCopied')">
          <v-tooltip top v-model="addressCopied">
            <span>copied</span>
            <span slot="activator"></span>
          </v-tooltip>
        </div>
      </div>
      <div class="account">
        <span class="label">{{$t('secret seed')}}</span>
        <span class="value" id="secret">{{secret}}</span>
        <div class="copy" @click="copy('#secret', 'secretCopied')">
          <v-tooltip top v-model="secretCopied">
            <span>copied</span>
            <span slot="activator"></span>
          </v-tooltip>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Wallet from '@/lib/wallet';
  import Helper from '@/lib/helper';

  export default {
    name: 'wallet-create-new-account',
    props: ['passed'],
    mounted() {
      const account = Wallet.createAccount();
      this.$data.address = account.address;
      this.$data.secret = account.seed;
      this.$emit('enable-next');
    },
    data() {
      return {
        address: null,
        secret: null,
        addressCopied: false,
        secretCopied: false,
      };
    },
    methods: {
      seed() {
        return this.$data.secret;
      },
      copy(selector, tooltip) {
        const elem = document.querySelector(selector);
        Helper.copyToClipboard(elem);
        this.$data[tooltip] = true;
        setTimeout(() => {
          this.$data[tooltip] = false;
        }, 800);
      },
    },
  };
</script>

<style>
  .NewAccount h4 {
    font-size: 14px;
    font-weight: bold;
    color: #99a4b0;
    margin-top: -60px;
    margin-bottom: 39px;
  }

  .NewAccount .account {
    width: 600px;
    height: 100px;
    margin: 0 auto;
    border-radius: 2px;
    background-color: #ffffff;
    font-size: 14px;
    color: #728395;
    padding: 42px 0 20px 0;
    text-align: left;
  }

  .NewAccount .account:nth-child(even) {
    padding: 20px 0 42px 0;
  }

  .NewAccount .account .label {
    display: inline-block;
    width: 178px;
    height: 38px;
    font-size: 16px;
    font-weight: bold;
    text-align: left;
    color: #728395;
    vertical-align: top;
    line-height: 38px;
    padding-left: 60px;
  }

  .NewAccount .account .value {
    display: inline-block;
    width: 280px;
    height: 38px;
    word-break: break-all;
  }

  .NewAccount .account .copy {
    display: inline-block;
    margin-left: 50px;
    cursor: pointer;
    width: 32px;
    height: 32px;
    background: url(../../assets/svg/copy.svg);
    background-size: 32px 32px;
  }
  .NewAccount .account .copy:hover {
    background: url(../../assets/svg/copy-hover.svg);
  }
  .NewAccount .account .copy:active {
    background: url(../../assets/svg/copy-active.svg);
  }
</style>
