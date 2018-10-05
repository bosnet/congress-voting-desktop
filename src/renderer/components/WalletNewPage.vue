<template>
  <v-stepper v-model="stepNo">
    <v-stepper-header>
      <v-stepper-step :complete="stepNo > 1" step="1">계좌 가져오기</v-stepper-step>
      <v-divider></v-divider>
      <v-stepper-step :complete="stepNo > 2" step="2">계좌 이름 설정</v-stepper-step>
      <v-divider></v-divider>
      <v-stepper-step :complete="stepNo > 3" step="3">암호 설정</v-stepper-step>
      <v-divider></v-divider>
      <v-stepper-step step="4">확인</v-stepper-step>
    </v-stepper-header>

    <v-stepper-items>
      <v-stepper-content step="1">
        <v-card class="mb-5" height="200px">
          <v-container fluid grid-list-sm>
            <v-layout row wrap v-if="step == 'initialize'">
              <v-flex xs12>
                <div v-if="inputSource == 'secret-seed'">
                  <SecretSeed ref="secretSeed" />
                </div>
                <div v-else>
                  <RecoveryKey ref="recoveryKey" />
                </div>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card>
        <v-btn color="primary" @click="loadSeed()">Continue</v-btn>
      </v-stepper-content>

      <v-stepper-content step="2">
        <v-card class="mb-5" height="200px">
          <v-container fluid grid-list-sm>
            <v-layout row wrap>
              <v-flex xs12>
                <v-layout row wrap>
                  <v-flex xs12>
                    <v-text-field label="Title" ref="title"/>
                  </v-flex>
                </v-layout>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card>
        <v-btn flat @click="back()">Back</v-btn>
        <v-btn color="primary" @click="setTitle()">Continue</v-btn>
      </v-stepper-content>

      <v-stepper-content step="3">
        <v-card class="mb-5" height="200px">
          <v-container fluid grid-list-sm>
            <v-layout row wrap>
              <v-flex xs12>
                <v-layout row wrap>
                  <v-flex xs12>
                    <v-text-field label="Passphrase" ref="passphrase" type="password"/>
                  </v-flex>
                </v-layout>
                <v-layout row wrap>
                  <v-flex xs12>
                    <v-text-field label="Passphrase Confirm" ref="passphraseConfirm" type="password"/>
                  </v-flex>
                </v-layout>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card>
        <v-btn flat @click="back()">Back</v-btn>
        <v-btn color="primary" @click="setPassphrase()">Continue</v-btn>
      </v-stepper-content>

      <v-stepper-content step="4">
        <v-card class="mb-5" height="200px">
          <div>{{ title }}</div>
          <div>{{ address }}</div>
        </v-card>
        <v-btn flat @click="back()">Back</v-btn>
        <v-btn color="primary" @click="complete()">Complete</v-btn>
      </v-stepper-content>
    </v-stepper-items>
  </v-stepper>
</template>

<script>
  import Wallet from '@/lib/wallet';
  import SecretSeed from './wallet-new/SecretSeed';
  import RecoveryKey from './wallet-new/RecoveryKey';

  export default {
    name: 'onboarding',
    components: {
      SecretSeed,
      RecoveryKey,
    },
    beforeMount() {
      this.inputSource = this.$route.query.source;
    },
    data() {
      return {
        inputSource: null,
        step: 'initialize',
        stepNo: 1,
        seed: null,
        address: null,
        passphrase: null,
        title: null,
      };
    },
    methods: {
      back() {
        if (this.stepNo > 1) {
          this.stepNo -= 1;
        }
      },

      loadSeed() {
        let seed = null;
        if (this.inputSource === 'secret-seed') {
          seed = this.$refs.secretSeed.seed();
        } else if (this.inputSource === 'recovery-key') {
          seed = this.$refs.recoveryKey.seed();
        }

        if (seed != null) {
          this.stepNo = 2;
          this.seed = seed;
        }
      },

      setTitle() {
        const title = this.$refs.title.inputValue;

        if (title != null && title !== '') {
          this.stepNo = 3;
          this.title = title;
          this.$refs.title.inputValue = '';
        }
      },

      setPassphrase() {
        const passphrase = this.$refs.passphrase.inputValue;
        if (passphrase === this.$refs.passphraseConfirm.inputValue) {
          this.stepNo = 4;
          this.passphrase = passphrase;
          this.$refs.passphrase.inputValue = '';
          this.$refs.passphraseConfirm.inputValue = '';
        }
      },

      complete() {
        const data = Wallet.encryptWallet(this.passphrase, this.seed);
        this.$store.dispatch('addWallet', {
          title: this.title,
          address: Wallet.parsePubKey(this.seed),
          data,
        }).then(() => {
          this.$router.push({ name: 'wallet-list' });
        });
      },

      cancel() {
        this.$router.push({ name: 'wallet-list' });
      },
    },
  };
</script>

<sytle>
</sytle>

