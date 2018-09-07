<template>
  <v-layout row justify-center>
    <v-dialog v-model="dialog" persistent max-width="400">
      <v-card>
        <v-card-title class="headline"></v-card-title>
        <v-card-text>
          <v-layout>
            <v-flex>
              <v-text-field v-model="passphrase"
                            :rules="passphraseRules" :label="$t('passphrase')" required/>
            </v-flex>
          </v-layout>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn flat @click.native="dialog = false">{{$t('close')}}</v-btn>
          <v-btn color="red darken-1" flat @click="confirm()">{{$t('agree')}}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
  export default {
    props: [],
    data() {
      return {
        dialog: false,
        passphraseRules: [],
      };
    },
  };
</script>
