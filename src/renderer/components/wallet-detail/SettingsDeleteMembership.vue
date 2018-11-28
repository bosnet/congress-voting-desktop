<template>
  <div class="SettingsDeleteMembership">
    <div class="SettingsDeleteMembershipBody impossible" v-if="isOngoingProposal">
      <img :src="impossibleDeleteAccountImg" />
      <h3>{{$t('you can not delete your membership now')}}</h3>
      <hr>
      <div class="desc">{{$t('if there is ongoing votes, you can not delete you membership')}}</div>
    </div>
    <div class="SettingsDeleteMembershipBody" v-else>
      <h3>{{$t('deregistering your membership guide')}}</h3>
      <span>{{$t('please read following before deregistering your membership')}}</span>
      <hr>
      <ul>
        <li>{{$t('deregistirng membership warning message 1')}}</li>
        <li>{{$t('deregistirng membership warning message 2')}}</li>
        <li>{{$t('deregistirng membership warning message 3')}}</li>
        <li>{{$t('deregistirng membership warning message 4')}}</li>
        <li>{{$t('deregistirng membership warning message 5')}}</li>
      </ul>
      <button class="button" @click="openPassphraseDialog">{{$t('deregistering your membership')}}</button>
    </div>
    <bos-toast v-model="showMessage" :timeout="3000" pullRight>{{message}}</bos-toast>
    <bos-passphrase-dialog ref="passphraseDialog"/>
  </div>
</template>

<script>
  import impossibleDeleteAccountImg from '../../assets/svg/settings-impossible-delete-account.svg';

  export default {
    name: 'bos-wallet-settings-delete-membership',
    props: ['wallet'],
    data() {
      return {
        impossibleDeleteAccountImg,
        showMessage: false,
        message: '',
      };
    },
    asyncComputed: {
      isOngoingProposal() {
        return this.$store.getters.isOngoingProposal();
      },
    },
    methods: {
      openPassphraseDialog() {
        this.$refs.passphraseDialog.open({
          confirmCallback: this.deregisterMembership,
        });
      },
      async unfreezeAll(passphrase) {
        try {
          await this.$store.dispatch('loadFrozenAccounts', this.wallet.address);
          const frozenAccounts = this.$store.state.RPC.frozenAccountOps;

          const promises = frozenAccounts.map(account => this.$store.dispatch('unfreeze', {
            ownerAddress: this.wallet.address,
            address: account.address,
            sequenceId: account.sequence_id,
            passphrase,
          }));

          await Promise.all(promises);
        } catch (ignore) {} // eslint-disable-line
      },
      async deregisterMembership({ passphrase }) {
        try {
          await this.$store.dispatch('deregisterMembership', {
            address: this.wallet.address,
            passphrase,
          });

          this.unfreezeAll(passphrase);

          this.message = this.$t('your membership is deregistered');
          this.showMessage = true;
          setTimeout(() => {
            this.showMessage = false;
            this.$router.push('/wallets');
          }, 2000);
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
      },
    },
    mounted() {
      this.$store.state.App.ga.send('screenview', { cd: 'bos-wallet-settings-delete-membership' });
    },
  };
</script>

<style>
  .SettingsDeleteMembershipBody {
    background-color: #fff;
    padding: 50px;
    font-size: 14px;
    color: #333333;
  }

  .SettingsDeleteMembershipBody h3 {
    font-size: 30px;
    font-weight: bold;
    color: #333333;
    margin-bottom: 10px;
  }

  .SettingsDeleteMembershipBody > span {
    width: 400px;
    display: block;
    word-break: keep-all;
  }

  .SettingsDeleteMembershipBody hr {
    margin-top: 30px;
    margin-bottom: 30px;
    border: 1px solid #f1f2f3;
  }

  .SettingsDeleteMembershipBody ul {
    font-size: 14px;
    color: #333333;
    line-height: 28px;
  }

  .SettingsDeleteMembershipBody .button {
    margin: 70px auto 0;
    width: auto;
    padding-left: 40px;
    padding-right: 40px;
  }

  .SettingsDeleteMembershipBody.impossible {
    text-align: center;
    padding-bottom: 130px;
  }

  .SettingsDeleteMembershipBody.impossible img {
    margin-top: 41px;
    margin-bottom: 20px
  }

  .SettingsDeleteMembershipBody.impossible h3 {
    font-size: 25px;
    font-weight: bold;
    color: #728395;
  }

  .SettingsDeleteMembershipBody.impossible hr {
    width: 120px;
    height: 1px;
    margin: 15px auto;
    background-color: #c4d1d6;
    border: none;
  }

  .SettingsDeleteMembershipBody.impossible .desc {
    font-size: 14px;
    color: #728395;
    width: 330px;
    margin: 0 auto;
    word-break: keep-all;
  }
</style>
