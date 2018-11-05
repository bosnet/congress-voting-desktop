<template>
  <section class="MembershipRegister">
    <div class="before" v-if="!completed">
      <img :src="membershipFreezingImg" />
      <h2>{{$t('requesting freezing')}}</h2>
      <hr>
      <span>{{$t('registering membership guide')}}</span>
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
    <bos-toast v-model="showMessage" :timeout="3000">{{message}}</bos-toast>
  </section>
</template>

<script>
  import FreezingDialog from './FreezingDialog';

  import membershipReadyImg from '../../assets/svg/membership-ready.svg';
  import membershipFreezingImg from '../../assets/svg/membership-freezing.svg';

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
        membershipFreezingImg,
        isFrozen: false,
        showMessage: false,
        message: '',
        passphrase: null,
      };
    },
    computed: {
      completedButton() {
        return this.isFrozen ? this.$t('go to vote') : this.$t('please wait');
      },
    },
    methods: {
      freezingRequested(passphrase) {
        this.completed = true;
        this.passphrase = passphrase;
        this.$root.$on('tick', this.tick);
      },
      async activateMembership() {
        const ops = this.$store.state.RPC.frozenAccountOps;
        if (ops.length > 0 && ops[0].state === 'frozen') {
          this.$root.$off('tick', this.tick);

          try {
            await this.$store.dispatch('registerMembership', {
              address: this.wallet.address,
              passphrase: this.passphrase,
              frozenAddress: ops[0].address,
            });

            this.update();
          } catch (err) {
            if (err.message.match(/bad decrypt/)) {
              this.message = this.$t('passphrase is wrong');
            } else if (err.response && err.response.status >= 400 && err.response.status < 500) {
              if (err.response.data && err.response.data.error) {
                this.message = err.response.data.error;
              } else {
                this.message = this.$t('something is wrong');
              }
            } else {
              this.message = this.$t('something is wrong');
            }

            this.showMessage = true;
          }
        }
      },
      async update() {
        // TODO: fix routing to proposals
        await this.$store.dispatch('updateMembership', [this.wallet.address]);
        this.isFrozen = true;
      },
      openfreezingDialog() {
        this.$refs.freezingDialog.open();
      },
      loadOps() {
        return this.$store.dispatch('loadFrozenAccounts', this.wallet.address);
      },
      tick() {
        this.loadOps();
        this.activateMembership();
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

  .MembershipRegister .before img {
    margin: 8px auto 25px;
    display: block;
  }

  .MembershipRegister .before h2 {
    font-size: 25px;
    font-weight: bold;
    color: #728395;
    text-align: center;
    width: 400px;
    word-break: keep-all;
    margin: 0 auto 15px;
  }

  .MembershipRegister .before hr {
    width: 120px;
    background-color: #c4d1d6;
    margin: 0 auto;
  }

  .MembershipRegister .before span {
    width: 100%;
    display: block;
    font-size: 14px;
    color: #728395;
    text-align: center;
    word-break: keep-all;
    margin: 15px auto 60px;
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

  .MembershipRegister .after hr {
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
