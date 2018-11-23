<template>
  <div class="SettingsDeleteMembership">
    <div class="SettingsDeleteMembershipBody">
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
  export default {
    name: 'bos-wallet-settings-delete-membership',
    props: ['wallet'],
    data() {
      return {
        showMessage: false,
        message: '',
      };
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
  }
</style>
