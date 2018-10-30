<template>
  <v-dialog v-model="show" persistent max-width="400" row justify-center>
    <v-form ref="form" v-model="valid" lazy-validation>
      <v-card>
        <v-card-title class="headline">{{ title }}</v-card-title>
        <v-card-text>
          <v-layout>
            <v-flex>
              <v-text-field v-model="passphrase" ref="passphraseText" type="password"
                            :rules="passphraseRules" :label="$t('passphrase')" required/>
            </v-flex>
          </v-layout>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn flat @click="close()">{{$t('close')}}</v-btn>
          <v-btn color="red darken-1" flat @click="confirm"
                 :disabled="!valid">
            {{$t('confirm')}}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script>
  export default {
    name: 'passphrase-dialog',
    props: ['callback'],
    methods: {
      open({ title, confirmCallback }) {
        this.show = true;
        this.title = title;
        this.confirmCallback = confirmCallback;
      },
      confirm() {
        if (this.confirmCallback) {
          this.confirmCallback(this.passphrase);
        }
        this.close();
      },
      close() {
        this.$refs.form.reset();
        this.show = false;
      },
    },
    data() {
      return {
        show: false,
        valid: false,
        title: null,
        confirmCallback: null,
        passphrase: null,
        passphraseRules: [
          v => !!v || 'Passphrase is required',
        ],
      };
    },
  };
</script>
