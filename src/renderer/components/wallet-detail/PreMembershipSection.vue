<template>
  <section class="PreMembershipRegister">
    <div v-if="!showKYC">
      <h2>{{$t('joining membership and then attend congress voting')}}</h2>
      <span>{{$t('membership benefit')}}</span>
      <img :src="membershipKycImg" alt="join membership" />
      <button class="button" @click="startKYC()">{{$t('registering membership')}}</button>
    </div>
    <div v-else>
      <div id="idensic"></div>
      <passphrase-dialog ref="passphraseDialog" :callback="registerPreMembership"/>
    </div>
  </section>
</template>

<script>
  import config from 'config';
  import idensic from '@/lib/idensic';

  import PassphraseDialog from './PassphraseDialog';
  import membershipKycImg from '../../assets/svg/membership-kyc.svg';

  export default {
    name: 'bos-wallet-pre-membership-section',
    props: ['wallet'],
    components: {
      PassphraseDialog,
    },
    data() {
      return {
        membershipKycImg,
        showKYC: false,
        applicantId: null,
      };
    },
    asyncComputed: {
      accessToken() {
        if (this.wallet.address != null) {
          return this.$store.getters.getSumsubAccessToken(this.wallet.address);
        }
        return {};
      },
    },
    watch: {
      accessToken() {
        if (this.showKYC) {
          this.startKYC();
        }
      },
    },
    methods: {
      startKYC() {
        this.showKYC = true;
        if (!this.accessToken.data) {
          return false;
        }
        this.$nextTick(() => {
          idensic.init(
            this.$el.querySelector('#idensic'),
            {
              accessToken: this.accessToken.data,
              lang: 'en',
              applicantDataPage: {
                enabled: true,
                fields: [
                  { name: 'firstName', required: true },
                  { name: 'lastName', required: true },
                  { name: 'email', required: true },
                  { name: 'phone', required: true },
                  { name: 'addresses', required: true },
                ],
              },
              requiredDocuments: 'IDENTITY:PASSPORT,ID_CARD,DRIVERS;SELFIE:SELFIE',
              copyConf: {
                agreementText: this.$t('agreement text'),
                privacyText: this.$t('privacy text'),
              },
              uiConf: {
                customCssUrl: config.get('sumsub').customCss,
              },
            },
            (messageType, payload) => {
              if (messageType === 'idCheck.onApplicantCreated') {
                this.applicantId = payload.applicantId;
              } else if (messageType === 'idCheck.onApplicantSubmitted') {
                this.openPassphraseDialog();
              }
            },
          );
        });
        return true;
      },
      async registerPreMembership({ passphrase }) {
        await this.$store.dispatch('preMembership', {
          address: this.wallet.address,
          applicantId: this.applicantId,
          passphrase,
        });
        this.$router.push('/');
      },
      openPassphraseDialog() {
        this.$refs.passphraseDialog.open();
      },
    },
  };
</script>

<style>
  .PreMembershipRegister {
    padding: 70px;
    text-align: center;
    height: 615px;
    overflow-y: auto;
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

  .PreMembershipRegister span {
    width: 100%;
    display: block;
    font-size: 14px;
    color: #728395;
    text-align: center;
  }

  .PreMembershipRegister img {
    margin: 30px 0;
  }

  .PreMembershipRegister .button {
    margin: 0 auto;
  }
</style>
