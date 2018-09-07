<template>
  <v-layout row justify-center>
    <v-dialog v-model="dialog" persistent max-width="400">
      <v-card>
        <v-card-title class="headline"></v-card-title>
        <v-card-text>
          <v-layout>
            <v-flex>
              <v-text-field v-model="amount" ref="amountText"
                            :rules="amountRules" :label="$t('unit')" required/>
            </v-flex>
          </v-layout>
          <v-layout>
            <v-flex>
              <v-text-field v-model="passphrase" ref="passphraseText" type="password"
                            :rules="passphraseRules" :label="$t('passphrase')" required/>
            </v-flex>
          </v-layout>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn flat @click="dialog = false">{{$t('close')}}</v-btn>
          <v-btn color="red darken-1" flat @click="agree">{{$t('agree')}}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
  export default {
    name: 'freeze-dialog',
    props: ['freeze'],
    methods: {
      open() {
        this.dialog = true;
      },
      agree() {
        this.freeze(this.amount, this.passphrase).then(() => {
          this.$refs.amountText.reset();
          this.$refs.passphraseText.reset();
          this.dialog = false;
        });
      },
    },
    data() {
      return {
        dialog: false,
        passphrase: null,
        passphraseRules: [
          v => !!v || 'Passphrase is required',
        ],
        amount: null,
        amountRules: [
          v => !!v || 'Amount is required',
          v => (v > 0 && v % 10000 === 0) || 'Amount should be a multiple of 10000',
        ],
      };
    },
  };
</script>
