<template>
  <v-dialog v-model="dialog" fullscreen persistent hide-overlay content-class="UnfreezingWithdrawDialogOverlay">
    <v-stepper v-model="stepNo" class="UnfreezingWithdrawDialog">
      <v-stepper-items>
        <v-stepper-content step="1" class="step1">
          <h3>{{$t('withdrawing all from the frozen account')}}</h3>
          <span class="desc">{{$t('the frozen account will be removed after you withdraw them')}}</span>
          <div class="preview">
            <div class="row">
              <span class="label">{{$t('receiving account')}}</span>
              <span class="value">{{receivingAccount}}</span>
            </div>
            <div class="row">
              <span class="label">{{$t('freezing amount')}}</span>
              <span class="value">{{totalAmount | bos}}</span>
            </div>
            <div class="row">
              <span class="label">{{$t('fee')}}</span>
              <span class="value">{{fee}}</span>
            </div>
            <div class="row">
              <span class="label">{{$t('total withdrawal')}}</span>
              <span class="value">{{totalWithdraw | bos}}<abbr>BOS</abbr></span>
            </div>
          </div>
          <button class="button" @click="stepNo=2">{{$t('entering passphrase')}}</button>
        </v-stepper-content>

        <v-stepper-content step="2" class="step2">
          <h3>{{$t('confirm passphrase')}}</h3>
          <v-text-field v-model="passphrase" ref="passphraseText" type="password"
                        :rules="passphraseRules" :label="$t('enter your passphrase')" required/>
          <button class="button" @click="submit">{{$t('done')}}</button>
        </v-stepper-content>
      </v-stepper-items>

      <div class="stepIndicator">
        <span :class="{step: true, on: (stepNo === 1)}"></span>
        <span :class="{step: true, on: (stepNo === 2)}"></span>
      </div>

      <img :src="closeIcon" @click="reset" class="UnfreezingWithdrawDialogClose" alt="close"/>
    </v-stepper>
    <bos-toast v-model="showMessage" :timeout="3000" pullRight>{{message}}</bos-toast>
  </v-dialog>
</template>

<script>
  import Unit from '@/lib/unit';

  import closeIcon from '../../assets/svg/close.svg';

  export default {
    name: 'unfreezing-withdraw-dialog',
    props: ['frozenAccount', 'generalAccount', 'callback'],
    data() {
      return this.init();
    },
    computed: {
      receivingAccount() {
        return this.generalAccount.title;
      },
      totalAmount() {
        return this.frozenAccount.amount;
      },
      totalWithdraw() {
        return this.totalAmount - Unit.convert(this.fee, 'bos', 'gon');
      },
    },
    methods: {
      init() {
        return {
          fee: 0.001,
          dialog: false,
          stepNo: 1,
          passphrase: null,
          passphraseRules: [
            v => !!v || this.$t('enter your passphrase'),
          ],
          showMessage: false,
          message: '',
          closeIcon,
        };
      },
      open() {
        this.dialog = true;
      },
      reset() {
        this.dialog = false;
        Object.assign(this.$data, this.init());
      },
      async submit() {
        try {
          await this.$store.dispatch('withdraw', {
            address: this.frozenAccount.linked,
            frozenAccountAddress: this.frozenAccount.address,
            sequenceId: this.frozenAccount.sequence_id,
            passphrase: this.passphrase,
          });
        } catch (err) {
          if (err.message.match(/bad decrypt/)) {
            this.message = this.$t('passphrase is wrong');
            this.showMessage = true;
            return;
          }

          throw err;
        }
        if (this.callback) {
          this.callback();
        }
        this.reset();
      },
    },
    mounted() {
      this.$store.state.App.ga.send('screenview', { cd: 'unfreezing-withdraw-dialog' });
    },
  };
</script>

<style>
  .UnfreezingWithdrawDialogOverlay {
    background-color: rgba(216, 223, 232, 0.7);
    height: 100%;
    width: 714px;
    margin-left: 158px;
    display: flex;
    align-items: center;
    justify-items: center;
  }

  .UnfreezingWithdrawDialog.theme--light.v-stepper {
    padding: 42px 36px 31px;
    position: relative;
    width: 634px;
    height: 550px;
    border-radius: 2px;
    box-shadow: 0 6px 20px 0 rgba(178, 199, 220, 0.8);
    border: solid 1px #ececec;
    background-color: #ffffff;
    color: #333333;
    margin-left: 40px;
  }

  .UnfreezingWithdrawDialogClose {
    position: absolute;
    top: 30px;
    right: 30px;
    cursor: pointer;
  }

  .UnfreezingWithdrawDialog h3 {
    text-align: center;
    font-size: 30px;
    font-weight: bold;
  }

  .UnfreezingWithdrawDialog span {
    font-size: 14px;
    color: #333333;
    display: block;
    margin: 5px auto 0;
    text-align: center;
  }

  .UnfreezingWithdrawDialog .button {
    margin: 0 auto;
  }

  .UnfreezingWithdrawDialog .stepIndicator {
    text-align: center;
    height: 20px;
    margin-top: -7px
  }

  .FreezingDialog .v-stepper__content {
    padding-bottom: 0;
  }

  .FreezingDialog .v-stepper__wrapper {
    padding-bottom: 15px;
  }

  .UnfreezingWithdrawDialog .step {
    display: inline-block;
    width: 6px;
    height: 6px;
    border-radius: 6px;
    background-color: #bdc2c7;
  }

  .UnfreezingWithdrawDialog .step.on {
    background-color: #3c92e4;
  }

  .UnfreezingWithdrawDialog .step1 .desc {
    margin-bottom: 36px;
  }

  .UnfreezingWithdrawDialog .step1 .preview {
    width: 450px;
    margin: 0 auto 38px;
    border-top: dashed 1px #b3bec8;
    border-bottom: dashed 1px #b3bec8;
  }

  .UnfreezingWithdrawDialog .step1 .preview .row {
    display: flex;
    align-items: center;
    margin: 10px auto;
    width: 374px;
    height: 27px;
  }

  .UnfreezingWithdrawDialog .step1 .preview .row:first-child {
    margin-top: 24px;
    margin-bottom: 25px;
  }

  .UnfreezingWithdrawDialog .step1 .preview .row:last-child {
    height: 37px;
    margin-top: 20px;
    margin-bottom: 20px;
  }

  .UnfreezingWithdrawDialog .step1 .preview .row .label {
    width: 100px;
    text-align: left;
  }

  .UnfreezingWithdrawDialog .step1 .preview .row .value {
    width: 274px;
    text-align: right;
    position: relative;
    font-size: 18px;
  }

  .UnfreezingWithdrawDialog .step1 .preview .row:last-child .value {
    font-size: 25px;
    font-weight: bold;
    color: #333333;
  }

  .UnfreezingWithdrawDialog .step1 .preview .row:last-child .value abbr {
    font-size: 10px;
    color: #909090;
    position: absolute;
    bottom: 6px;
    right: -24px;
  }

  .UnfreezingWithdrawDialog .step2 .v-input {
    width: 400px;
    margin: 72px auto 125px;
  }
</style>
