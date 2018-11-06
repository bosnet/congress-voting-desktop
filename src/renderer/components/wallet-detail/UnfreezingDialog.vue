<template>
  <v-dialog v-model="dialog" fullscreen persistent hide-overlay content-class="UnfreezingDialogOverlay">
    <v-stepper v-model="stepNo" class="UnfreezingDialog">
      <v-stepper-items>
        <v-stepper-content step="1" class="step1">
          <h3>{{$t('requesting unfreezing')}}</h3>
          <!-- FIXME: show unfeezing date -->
          <span class="desc">{{$t('you can withdraw after unfreezing', { account: wallet.title, until: '' })}}</span>
          <div class="preview">
            <div class="row">
              <span class="label">{{$t('unfreezing amount')}}</span>
              <span class="value">{{totalAmount | bos}}</span>
            </div>
            <div class="row">
              <span class="label">{{$t('fee')}}</span>
              <span class="value">{{totalFee}}</span>
            </div>
            <div class="row">
              <span class="label">{{$t('total withdrawal')}}</span>
              <span class="value">{{totalWithdraw | bos}}<em>BOS</em></span>
            </div>
          </div>
          <span class="desc2">{{$t('unfreezing is not cancelable, you can withdraw it after 14 days')}}</span>
          <button class="button" @click="stepNo=2">{{$t('entering passphrase')}}</button>
        </v-stepper-content>

        <v-stepper-content step="2" class="step2">
          <h3>{{$t('confirm passphrase')}}</h3>
          <span>{{$t('unfreezing is not cancelable, you can withdraw it after 14 days')}}</span>
          <v-text-field v-model="passphrase" ref="passphraseText" type="password"
                        :rules="passphraseRules" :label="$t('enter your passphrase')" required/>
          <button class="button" @click="submit">{{$t('done')}}</button>
        </v-stepper-content>
      </v-stepper-items>

      <div class="stepIndicator">
        <span :class="{step: true, on: (stepNo === 1)}"></span>
        <span :class="{step: true, on: (stepNo === 2)}"></span>
      </div>

      <img :src="closeIcon" @click="reset" class="UnfreezingDialogClose" alt="close"/>
    </v-stepper>
    <bos-toast v-model="showMessage" :timeout="3000">{{message}}</bos-toast>
  </v-dialog>
</template>

<script>
  import Unit from '@/lib/unit';
  import Helper from '@/lib/helper';

  import closeIcon from '../../assets/svg/close.svg';

  export default {
    name: 'unfreezing-dialog',
    props: ['wallet', 'callback'],
    data() {
      return this.init();
    },
    computed: {
      totalAmount() {
        if (this.accounts) {
          return this.accounts
            .reduce((accum, cur) => Helper.sumAmount(accum, cur.amount), '0');
        }
        return null;
      },
      totalFee() {
        return this.fee * (this.accounts ? this.accounts.length : 0);
      },
      totalWithdraw() {
        return this.totalAmount - Unit.convert(this.totalFee, 'bos', 'gon');
      },
    },
    methods: {
      init() {
        return {
          dialog: false,
          fee: 0.001,
          stepNo: 1,
          accounts: null,
          passphrase: null,
          passphraseRules: [
            v => !!v || this.$t('enter your passphrase'),
          ],
          showMessage: false,
          message: '',
          closeIcon,
        };
      },
      open(accounts) {
        this.accounts = accounts;
        this.dialog = true;
      },
      reset() {
        this.dialog = false;
        Object.assign(this.$data, this.init());
      },
      async submit() {
        try {
          const promises = this.accounts.map(account => this.$store.dispatch('unfreeze', {
            ownerAddress: this.wallet.address,
            address: account.address,
            sequenceId: account.sequence_id,
            passphrase: this.passphrase,
          }));

          await Promise.all(promises);
        } catch (err) {
          if (err.message.match(/bad decrypt/)) {
            this.message = this.$t('passphrase is wrong');
            this.showMessage = true;
            return;
          } else if (err.response && err.response.status >= 400 && err.response.status < 500) {
            if (err.response.data && err.response.data.error) {
              this.message = err.response.data.error;
            } else {
              this.message = this.$t('something is wrong');
            }
            this.showMessage = true;
            return;
          }

          throw err;
        }
        this.dialog = false;
        if (this.callback) {
          this.callback();
        }
      },
    },
  };
</script>

<style>
  .UnfreezingDialogOverlay {
    background-color: rgba(216, 223, 232, 0.7);
    height: 100%;
    width: 714px;
    margin-left: 158px;
    display: flex;
    align-items: center;
    justify-items: center;
  }

  .UnfreezingDialog.theme--light.v-stepper {
    padding: 56px 36px 31px;
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

  .UnfreezingDialogClose {
    position: absolute;
    top: 30px;
    right: 30px;
    cursor: pointer;
  }

  .UnfreezingDialog h3 {
    text-align: center;
    font-size: 30px;
    font-weight: bold;
  }

  .UnfreezingDialog span {
    font-size: 14px;
    color: #333333;
    display: block;
    margin: 5px auto 0;
    text-align: center;
  }

  .UnfreezingDialog .button {
    margin: 0 auto;
  }

  .UnfreezingDialog .stepIndicator {
    text-align: center;
    height: 20px;
  }

  .UnfreezingDialog .step {
    display: inline-block;
    width: 5px;
    height: 5px;
    border-radius: 5px;
    background-color: #bdc2c7;
  }

  .UnfreezingDialog .step.on {
    background-color: #3c92e4;
  }

  .UnfreezingDialog .step1 .desc {
    margin-bottom: 39px;
  }

  .UnfreezingDialog .step1 .preview {
    width: 450px;
    margin: 0 auto 10px;
    border-top: dashed 1px #b3bec8;
    border-bottom: dashed 1px #b3bec8;
  }

  .UnfreezingDialog .step1 .preview .row {
    display: flex;
    align-items: center;
    margin: 10px auto;
    width: 349px;
    height: 27px;
  }

  .UnfreezingDialog .step1 .preview .row:last-child {
    height: 37px;
    margin-bottom: 20px;
  }

  .UnfreezingDialog .step1 .preview .row .label {
    width: 150px;
  }

  .UnfreezingDialog .step1 .preview .row .value {
    width: 199px;
    text-align: right;
    position: relative;
  }

  .UnfreezingDialog .step1 .preview .row:last-child .value {
    font-size: 25px;
    font-weight: bold;
    color: #333333;
  }

  .UnfreezingDialog .step1 .preview .row:last-child .value em {
    font-size: 10px;
    color: #909090;
    position: absolute;
    bottom: 6px;
    right: -22px;
  }

  .UnfreezingDialog .step1 .desc2 {
    font-size: 11px;
    color: #728395;
    margin-bottom: 40px;
  }

  .UnfreezingDialog .step2 .v-input {
    width: 400px;
    margin: 72px auto 125px;
  }
</style>
