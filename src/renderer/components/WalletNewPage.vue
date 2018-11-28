<template>
  <v-stepper v-model="stepNo" class="WalletNewPage">
    <v-stepper-items>
      <v-stepper-content step="1" class="step1">
        <h1>{{$t('choose how to import account')}}</h1>
        <div class="content">
          <div v-for="m in methods"
               :key="m.title"
               :to="m.to"
               :class="{method: true, on: (importMethod === m.name)}"
               @click="importMethod = m.name"
          >
            <img :src="m.iconOn" :alt="m.title" v-if="importMethod === m.name"/>
            <img :src="m.icon" :alt="m.title" v-else/>
            <span>{{ m.title }}</span>
          </div>
        </div>
        <button class="button" :disabled="!importMethod" @click="stepNo = 2">{{$t('next')}}</button>
      </v-stepper-content>

      <v-stepper-content step="2" class="step2">
        <SecretSeed
            ref="secretSeed"
            v-on:enable-next="step2passed = true"
            v-on:disable-next="step2passed = false"
            v-if="importMethod === 'secret-seed'"
        />
        <RecoveryKey
            ref="recoveryKey"
            v-on:enable-next="step2passed = true"
            v-on:disable-next="step2passed = false"
            v-else-if="importMethod === 'recovery-key'"
        />
        <NewAccount
            ref="newAccount"
            v-on:enable-next="step2passed = true"
            v-on:disable-next="step2passed = false"
            v-else-if="importMethod === 'create-account'"
        />
        <button class="button" :disabled="!step2passed" @click="loadSeed()">{{$t('next')}}</button>
      </v-stepper-content>

      <v-stepper-content step="3" class="step3">
        <Passphrase
            ref="passphrase"
            v-on:enable-next="step3passed = true"
            v-on:disable-next="step3passed = false"
        />
        <button class="button" :disabled="!step3passed" @click="setPassphrase()">{{$t('next')}}</button>
      </v-stepper-content>
    </v-stepper-items>

    <div>
      <span :class="{step: true, on: (stepNo === 1)}"></span>
      <span :class="{step: true, on: (stepNo === 2)}"></span>
      <span :class="{step: true, on: (stepNo === 3)}"></span>
    </div>

    <img :src="closeIcon" @click="reset" class="WalletNewPageClose" alt="close"/>
    <bos-shutdown v-if="shutdown"></bos-shutdown>
  </v-stepper>
</template>

<script>
  import Helper from '@/lib/helper';
  import Wallet from '@/lib/wallet';
  import SecretSeed from './wallet-new/SecretSeed';
  import RecoveryKey from './wallet-new/RecoveryKey';
  import NewAccount from './wallet-new/NewAccount';
  import Passphrase from './wallet-new/Passphrase';

  import importSeedIcon from '../assets/svg/import-method-seed.svg';
  import importSeedOnIcon from '../assets/svg/import-method-seed-on.svg';
  import importRecoverKeyIcon from '../assets/svg/import-method-recovery-key.svg';
  import importRecoverKeyOnIcon from '../assets/svg/import-method-recovery-key-on.svg';
  import importCreatingAccountIcon from '../assets/svg/import-method-creating-account.svg';
  import importCreatingAccountOnIcon from '../assets/svg/import-method-creating-account-on.svg';
  import closeIcon from '../assets/svg/close.svg';

  export default {
    name: 'wallet-new-page',
    props: ['close'],
    components: {
      SecretSeed,
      RecoveryKey,
      NewAccount,
      Passphrase,
    },
    data() {
      return {
        importMethod: null,
        stepNo: 1,
        step2passed: false,
        step3passed: false,
        seed: null,
        address: null,
        passphrase: null,
        methods: [
          {
            name: 'secret-seed',
            icon: importSeedIcon,
            iconOn: importSeedOnIcon,
            title: this.$t('import with secret seed'),
          },
          {
            name: 'recovery-key',
            icon: importRecoverKeyIcon,
            iconOn: importRecoverKeyOnIcon,
            title: this.$t('import with recovery key'),
          },
          {
            name: 'create-account',
            icon: importCreatingAccountIcon,
            iconOn: importCreatingAccountOnIcon,
            title: this.$t('create a new account'),
          },
        ],
        closeIcon,
        shutdown: false,
      };
    },
    methods: {
      loadSeed() {
        let seed = null;
        if (this.importMethod === 'secret-seed') {
          seed = this.$refs.secretSeed.seed();
        } else if (this.importMethod === 'recovery-key') {
          seed = this.$refs.recoveryKey.seed();
        } else if (this.importMethod === 'create-account') {
          seed = this.$refs.newAccount.seed();
        }

        if (seed != null) {
          this.seed = seed;
          this.stepNo = 3;
        }
      },

      setPassphrase() {
        const passphrase = this.$refs.passphrase.value();

        if (passphrase != null) {
          this.passphrase = passphrase;
          this.complete();
        }
      },

      complete() {
        const data = Wallet.encryptWallet(this.passphrase, this.seed);
        const address = Wallet.parsePubKey(this.seed);
        this.$store.dispatch('addWallet', {
          title: `Account ${address.substr(0, 6)}`,
          address,
          data,
        }).then(() => {
          this.$router.push({ name: 'wallet-list' });
          this.reset();
        });
      },

      reset() {
        this.close();
        setTimeout(() => {
          this.stepNo = 1;
          this.importMethod = null;
          this.stepNo = 1;
          this.step2passed = false;
          this.step3passed = false;
          this.seed = null;
          this.address = null;
          this.passphrase = null;
          this.$refs.passphrase.reset();
        }, 200);
      },
      async checkup() {
        const onTime = await Helper.checkup();
        this.shutdown = onTime;
        if (onTime) {
          this.shutdown = true;
        } else {
          this.shutdown = false;
        }
      },
    },
    mounted() {
      this.$store.state.App.ga.send('screenview', { cd: 'wallet-new-page' });
    },
  };
</script>

<style>
  .WalletNewPage {
    height: 100%;
  }

  .WalletNewPage .content {
    height: 200px;
    display: block;
  }

  .WalletNewPage h1 {
    color: #728395;
    margin: 76px 0 65px 0;
  }


  .WalletNewPage .v-stepper__content {
    padding-bottom: 8px;
  }

  .WalletNewPage .method {
    width: 180px;
    height: 190px;
    border-radius: 5px;
    background-color: #ffffff;
    display: inline-block;
    color: #728395;
    margin: 0 6px;
    padding-top: 30px;
    text-align: center;
    cursor: pointer;
    border: solid 3px #ffffff;
  }

  .WalletNewPage .method:hover {
    box-shadow: 0 3px 25px 0 #bedaf7;
  }

  .WalletNewPage .method.on {
    color: #3c92e4;
    box-shadow: 0 3px 25px 0 #bedaf7;
    border: solid 2px #3c92e4;
  }

  .WalletNewPage .method img {
    display: block;
    margin: 0 auto 15px;
  }

  .WalletNewPage .button {
    margin: 68px auto 16px;
  }

  .WalletNewPage .step {
    display: inline-block;
    width: 6px;
    height: 6px;
    border-radius: 6px;
    background-color: #bdc2c7;
  }

  .WalletNewPage .step.on {
    background-color: #3c92e4;
  }

  .WalletNewPageClose {
    position: absolute;
    top: 35px;
    right: 35px;
    cursor: pointer;
  }

  .WalletNewPage.theme--light.v-stepper {
    text-align: center;
  }
</style>

