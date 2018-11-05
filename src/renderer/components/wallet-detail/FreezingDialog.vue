<template>
  <v-dialog v-model="dialog" fullscreen persistent hide-overlay content-class="FreezingDialogOverlay">
    <v-stepper v-model="stepNo" class="FreezingDialog">
      <v-stepper-items>
        <v-stepper-content step="1" class="step1">
          <h3>{{$t('requesting freezing')}}</h3>
          <span>{{$t('freezing should be 10,000 bos at least')}}</span>
          <v-text-field
            v-model="amount"
            ref="amountText"
            :rules="amountRules"
            autofocus
            required
          >
          </v-text-field>
          <div class="unit" :style="{ marginLeft: `${unitMargin * 15}px` }">{{unit}}<em>BOS</em></div>
          <div class="currentAmount">{{$t('available amount')}} {{prettify(availableBalance)}} BOS</div>
          <button class="button" :disabled="!moveStep2" @click="stepNo=2">{{$t('freezing')}}</button>
        </v-stepper-content>

        <v-stepper-content step="2" class="step2">
          <h3>{{$t('requesting freezing')}}</h3>
          <span class="desc">{{$t('you can get rewords by frozen amount')}}</span>
          <div class="preview">
            <div class="row">
              <span class="label">{{$t('freezing amount')}}</span>
              <span class="value">{{prettify(amount + '0000')}}</span>
            </div>
            <div class="row">
              <span class="label">{{$t('fee')}}</span>
              <span class="value">0.001</span>
            </div>
            <div class="row">
              <span class="label">{{$t('total withdrawal')}}</span>
              <span class="value">{{prettify(amount + '0000.001')}}<em>BOS</em></span>
            </div>
          </div>
          <span class="desc2">{{$t('freezing is not cancelable, you should unfreezing it')}}</span>
          <button class="button" @click="stepNo=3">{{$t('entering passphrase')}}</button>
        </v-stepper-content>

        <v-stepper-content step="3" class="step3">
          <h3>{{$t('confirm passphrase')}}</h3>
          <span>{{$t('freezing is not cancelable, you should unfreezing it')}}</span>
          <v-text-field v-model="passphrase" ref="passphraseText" type="password"
                        :rules="passphraseRules" :label="$t('enter your passphrase')" required/>
          <button class="button" @click="submit">{{$t('done')}}</button>
        </v-stepper-content>
      </v-stepper-items>

      <div class="stepIndicator">
        <span :class="{step: true, on: (stepNo === 1)}"></span>
        <span :class="{step: true, on: (stepNo === 2)}"></span>
        <span :class="{step: true, on: (stepNo === 3)}"></span>
      </div>

      <img :src="closeIcon" @click="reset" class="FreezingDialogClose" alt="close"/>
    </v-stepper>
    <bos-toast v-model="showMessage" :timeout="3000">{{message}}</bos-toast>
  </v-dialog>
</template>

<script>
  import Unit from '@/lib/unit';
  import Helper from '@/lib/helper';

  import closeIcon from '../../assets/svg/close.svg';

  export default {
    name: 'freezing-dialog',
    props: ['wallet', 'callback'],
    data() {
      return this.init();
    },
    computed: {
      unit() {
        return (10000).toLocaleString().substr(1);
      },
    },
    methods: {
      init() {
        return {
          dialog: false,
          availableBalance: '0',
          fee: 0.001,
          stepNo: 1,
          moveStep2: false,
          unitMargin: 0,
          amount: null,
          amountRules: [
            (v) => {
              let amount = v ? v.match(/\d/g).join('') : '';
              if (parseInt(amount, 10) * 10000 > parseInt(this.availableBalance, 10)) {
                amount = this.availableBalance.substr(0, this.availableBalance.length - 4);
              }

              // add commas
              const temp = parseInt(amount * 10, 10).toLocaleString();
              const commaCount = temp.length - amount.length - 1;
              const numerCount = amount.length;
              amount = temp.substr(0, temp.length - 1);

              // move unit guide
              this.unitMargin = numerCount + (commaCount * 0.5);

              this.amount = amount;
              this.moveStep2 = !!amount;
              return true;
            },
          ],
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
      prettify(b) {
        return parseFloat(b, 10).toLocaleString();
      },
      reset() {
        this.dialog = false;
        Object.assign(this.$data, this.init());
        this.setBalance();
      },
      async submit() {
        try {
          await this.$store.dispatch('freeze', {
            address: this.wallet.address,
            amount: this.amount * 10000,
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
        this.dialog = false;
        if (this.callback) {
          this.callback(this.passphrase);
        }
      },
      getAccount() {
        if (this.wallet.address != null) {
          return this.$store.getters.account(this.wallet.address);
        }
        return null;
      },
      async setBalance() {
        const account = await this.getAccount();
        const available = Unit.convert(account.balance, 'gon', 'bos');
        this.availableBalance = Helper.fineMinimumFreezeAmount(available, this.fee);
      },
    },
    async mounted() {
      await this.setBalance();
    },
  };
</script>

<style>
  .FreezingDialogOverlay {
    background-color: rgba(216, 223, 232, 0.7);
    height: 100%;
    width: 714px;
    margin-left: 158px;
    display: flex;
    align-items: center;
    justify-items: center;
  }

  .FreezingDialog.theme--light.v-stepper {
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

  .FreezingDialogClose {
    position: absolute;
    top: 30px;
    right: 30px;
    cursor: pointer;
  }

  .FreezingDialog h3 {
    text-align: center;
    font-size: 30px;
    font-weight: bold;
  }

  .FreezingDialog span {
    font-size: 14px;
    color: #333333;
    display: block;
    margin: 5px auto 0;
    text-align: center;
  }

  .FreezingDialog .button {
    margin: 0 auto;
  }

  .FreezingDialog .stepIndicator {
    text-align: center;
    height: 20px;
  }

  .FreezingDialog .step {
    display: inline-block;
    width: 5px;
    height: 5px;
    border-radius: 5px;
    background-color: #bdc2c7;
  }

  .FreezingDialog .step.on {
    background-color: #3c92e4;
  }

  .FreezingDialog .step1 span {
    margin-bottom: 80px;
  }

  .FreezingDialog .step1 .unit {
    font-size: 25px;
    font-weight: bold;
    color: #333333;
    margin-top: -55px;
  }

  .FreezingDialog .step1 .unit em {
    font-size: 10px;
    color: #909090;
  }

  .FreezingDialog .step1 .theme--light.v-label.primary--text {
    color: #99a4b0 !important;
  }

  .FreezingDialog .step1 .v-text-field > .v-input__control > .v-input__slot:before {
    border-color: #1993f1;
  }

  .FreezingDialog .step1 .v-text-field > .v-input__control > .v-input__slot {
    font-size: 25px;
    font-weight: bold;
    color: #333333;
    position: relative;
  }

  .FreezingDialog .step1 .currentAmount {
    font-size: 12px;
    color: #1993f1;
    margin-top: 3px;
    margin-bottom: 113px;
  }

  .FreezingDialog .step2 .desc {
    margin-bottom: 39px;
  }

  .FreezingDialog .step2 .preview {
    width: 450px;
    margin: 0 auto 10px;
    border-top: dashed 1px #b3bec8;
    border-bottom: dashed 1px #b3bec8;
  }

  .FreezingDialog .step2 .preview .row {
    display: flex;
    align-items: center;
    margin: 10px auto;
    width: 349px;
    height: 27px;
  }

  .FreezingDialog .step2 .preview .row:last-child {
    height: 37px;
    margin-bottom: 20px;
  }

  .FreezingDialog .step2 .preview .row .label {
    width: 150px;
  }

  .FreezingDialog .step2 .preview .row .value {
    width: 199px;
    text-align: right;
    position: relative;
  }

  .FreezingDialog .step2 .preview .row:last-child .value {
    font-size: 25px;
    font-weight: bold;
    color: #333333;
  }

  .FreezingDialog .step2 .preview .row:last-child .value em {
    font-size: 10px;
    color: #909090;
    position: absolute;
    bottom: 6px;
    right: -22px;
  }

  .FreezingDialog .step2 .desc2 {
    font-size: 11px;
    color: #728395;
    margin-bottom: 40px;
  }

  .FreezingDialog .step3 .v-input {
    width: 400px;
    margin: 72px auto 125px;
  }
</style>
