<template>
  <section class="PreMembershipRegister">
    <div v-if="!showKYC">
      <h2>{{$t('joining membership and then attend congress voting')}}</h2>
      <span>{{$t('membership benefit')}}</span>
      <img :src="joiningMembershipImg" alt="join membership" />
      <button class="button" @click="startKYC()">{{$t('registering membership')}}</button>
    </div>
    <div v-else>
      <div id="idensic"></div>
    </div>
  </section>
</template>

<script>
  import config from 'config';
  import idensic from '@/lib/idensic';

  import joiningMembershipImg from './../../assets/svg/joining-membership.svg';

  export default {
    name: 'wallet-membership-section',
    props: ['address'],
    components: {
    },
    data() {
      return {
        joiningMembershipImg,
        showKYC: false,
        applicantId: null,
      };
    },
    asyncComputed: {
      accessToken() {
        if (this.address != null) {
          return this.$store.getters.getSumsubAccessToken(this.address);
        }
        return null;
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
                // TODO: send this.applicantId to voting server.
              }
            },
          );
        });
        return true;
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
