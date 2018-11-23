<template>
  <section :class="{PreMembershipRegister: true, kyc: showKYC}">
    <div v-if="!showKYC">
      <h2>{{$t('joining membership and then attend congress voting')}}</h2>
      <img :src="membershipKycImg" alt="join membership" />
      <button class="button" @click="openPassphraseDialog">{{$t('registering membership')}}</button>
      <span class="desc">{{$t('by registering an membership you agree to delegate authority to operate node')}}</span>
      <bos-passphrase-dialog ref="passphraseDialog"/>
      <bos-toast v-model="showMessage" :timeout="3000" pullRight>{{message}}</bos-toast>
    </div>
    <div v-else>
      <div id="idensic"></div>
    </div>
  </section>
</template>

<script>
  import config from '#config';
  import idensic from '@/lib/idensic';

  import membershipKycImg from '../../assets/svg/membership-kyc.svg';

  export default {
    name: 'bos-wallet-pre-membership-section',
    props: ['wallet'],
    data() {
      return {
        membershipKycImg,
        showKYC: false,
        applicantId: null,
        showMessage: false,
        message: '',
      };
    },
    methods: {
      startKYC(accessToken, passphrase) {
        this.showKYC = true;
        this.$nextTick(() => {
          const lang = navigator.language === 'ko' ? navigator.language : 'en';
          idensic.init(
            this.$el.querySelector('#idensic'),
            {
              accessToken,
              lang,
              applicantDataPage: {
                enabled: true,
                fields: [
                  { name: 'firstName', required: true },
                  { name: 'lastName', required: true },
                  { name: 'email', required: true },
                  { name: 'dob', required: true },
                ],
              },
              requiredDocuments: 'IDENTITY:PASSPORT,ID_CARD,DRIVERS;SELFIE:SELFIE',
              userAgreementUrl: 'https://boscoin.io/terms',
              privacyPolicyUrl: lang === 'ko' ? 'https://boscoin.io/consent/' : 'https://sumsub.com/boscoin-consent-to-personal-data-processing',
              uiConf: {
                customCssUrl: config.get('sumsub').customCss,
              },
            },
            (messageType, payload) => {
              if (messageType === 'idCheck.onApplicantCreated') {
                this.updateApplicantId(payload.applicantId, passphrase);
              } else if (messageType === 'idCheck.onApplicantSubmitted') {
                setTimeout(() => {
                  this.$store.dispatch('updateMembership', { wallets: [this.wallet], mutable: false });
                }, 2500);
              } else if (messageType === 'idCheck.onApplicantResubmitted') {
                this.updateApplicantId('ApplicantResubmitted', passphrase);
                setTimeout(() => {
                  this.$store.dispatch('updateMembership', { wallets: [this.wallet], mutable: false });
                }, 2500);
              }
            },
          );
        });
        return true;
      },
      async updateApplicantId(applicantId, passphrase) {
        try {
          await this.$store.dispatch('updateApplicantId', {
            address: this.wallet.address,
            applicantId,
            passphrase,
          });
        } catch (err) {
          if (err.response && err.response.status >= 400 && err.response.status < 500) {
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
      async registerPreMembership({ passphrase }) {
        try {
          await this.$store.dispatch('preMembership', {
            address: this.wallet.address,
            passphrase,
          });
          const token = await this.$store.getters.getSumsubAccessToken(this.wallet.address);
          this.startKYC(token.data, passphrase);
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
      openPassphraseDialog() {
        this.$refs.passphraseDialog.open({
          confirmCallback: this.registerPreMembership,
        });
      },
    },
  };
</script>

<style>
  .PreMembershipRegister {
    padding: 80px 70px 70px 70px;
    text-align: center;
    height: 615px;
    overflow-y: auto;
  }
  .PreMembershipRegister.kyc {
    padding-top: 25px;
  }

  .PreMembershipRegister h2 {
    font-size: 25px;
    font-weight: bold;
    color: #728395;
    text-align: center;
    width: 400px;
    word-break: keep-all;
    margin: 0 auto;
  }

  .PreMembershipRegister .desc {
    width: 100%;
    display: block;
    font-size: 13px;
    color: #728395;
    text-align: center;
  }

  .PreMembershipRegister img {
    margin: 25px 0 20px;
  }

  .PreMembershipRegister .button {
    margin: 0 auto 10px;
  }
</style>
