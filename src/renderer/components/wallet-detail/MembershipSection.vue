<template>
  <section class="MembershipRegister">
    <div class="before" v-if="!completed">
      <h2>{{$t('requesting freezing')}}</h2>
      <span>{{$t('registering membership guide')}}</span>
      <div class="img"></div>
      <button class="button" @click="openfreezingDialog">{{$t('freezing')}}</button>
      <freezing-dialog ref="freezingDialog" :wallet="wallet" :callback="freezingRequested"/>
    </div>
    <div class="after" v-else>
      <img :src="membershipReadyImg" />
      <h2>{{$t('congratuation')}}</h2>
      <h2>{{$t('now you can attend congress voting')}}</h2>
      <hr>
      <div class="guide">{{$t('membership guide message 1')}}</div>
      <div class="guide">{{$t('membership guide message 2')}}</div>
      <button class="button" :disabled="!isFrozen" @click="openfreezingDialog">{{completedButton}}</button>
    </div>
  </section>
</template>

<script>
  import FreezingDialog from './FreezingDialog';

  import membershipReadyImg from '../../assets/svg/membership-ready.svg';

  export default {
    name: 'wallet-membership-section',
    props: ['wallet'],
    components: {
      FreezingDialog,
    },
    data() {
      return {
        completed: false,
        membershipReadyImg,
        isFrozen: false,
      };
    },
    computed: {
      completedButton() {
        return this.isFrozen ? this.$t('go to vote') : this.$t('please wait');
      },
    },
    methods: {
      freezingRequested() {
        this.completed = true;
        this.loadOps();
        this.$root.$on('tick', this.tick);
        // TODO: check frozen account state and enable button
        // if (check) {
        // this.$store.state.RPC.frozenAccountOps;
        // this.$root.$off('tick', this.tick);
        // this.isFrozen = true;
        // }
      },
      openfreezingDialog() {
        this.$refs.freezingDialog.open();
      },
      loadOps() {
        return this.$store.dispatch('loadFrozenAccounts', this.wallet.address);
      },
      tick() {
        this.loadOps();
      },
    },
  };
</script>

<style>
  .MembershipRegister {
    padding: 70px;
    text-align: center;
    height: 615px;
    overflow-y: auto;
  }

  .MembershipRegister .before h2 {
    font-size: 25px;
    font-weight: bold;
    color: #728395;
    text-align: center;
    width: 400px;
    word-break: keep-all;
    margin: 0 auto 10px;
  }

  .MembershipRegister .before span {
    width: 100%;
    display: block;
    font-size: 14px;
    color: #728395;
    text-align: center;
    word-break: keep-all;
    margin: 0 auto;
    width: 500px;
    line-height: 30px;
  }

  .MembershipRegister .before .img {
    margin: 30px auto 48px;
    width: 176px;
    height: 176px;
    border-radius: 176px;
    opacity: 0.6;
    background-color: #ffffff;
  }

  .MembershipRegister .before .button {
    margin: 0 auto;
  }

  .MembershipRegister .after img {
    margin-top: 20px;
    margin-bottom: 25px;
  }

  .MembershipRegister .after h2 {
    font-size: 25px;
    font-weight: bold;
    color: #728395;
    text-align: center;
    word-break: keep-all;
    margin: 0 auto;
  }

  .MembershipRegister hr {
    width: 120px;
    background-color: #c4d1d6;
    margin: 15px auto;
  }

  .MembershipRegister .after .guide {
    font-size: 14px;
    color: #728395;
    word-break: keep-all;
    margin: 0 auto;
    width: 410px;
    line-height: 30px;
    text-align: left;
    padding-left: 10px;
  }

  .MembershipRegister .after .guide:before {
    content: "*";
    display: inline-block;
    margin-left: -10px;
    margin-right: 5px;
  }

  .MembershipRegister .after .button {
    margin: 60px auto 0;
  }
</style>
