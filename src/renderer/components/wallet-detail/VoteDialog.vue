<template>
  <v-layout row justify-center v-if="proposal != null">
    <v-dialog v-model="dialog" persistent max-width="400">
      <v-card>
        <v-card-title class="headline">{{ proposal.title }}</v-card-title>
        <v-card-text>
          <v-layout>
            <v-flex xs12>
              <v-combobox v-model="answer" :items="answers" chips label="Answer">
                <template slot="selection" slot-scope="data">
                  <v-chip
                      :selected="data.selected"
                      :disabled="data.disabled"
                      :key="JSON.stringify(data.item)"
                      class="v-chip--select-multi "
                      @input="data.parent.selectItem(data.item)"
                  >
                    <v-avatar class="accent white--text">
                      {{ data.item.slice(0, 1).toUpperCase() }}
                    </v-avatar>
                    {{ data.item }}
                  </v-chip>
                </template>
              </v-combobox>
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
          <v-btn color="red darken-1" flat @click="confirm">{{$t('confirm')}}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
  export default {
    name: 'passphrase-dialog',
    props: ['callback'],
    methods: {
      open(proposal) {
        this.proposal = proposal;
        this.dialog = true;
      },
      confirm() {
        const payload = {
          proposalId: this.proposal.id,
          answer: (this.answer || '').slice(0, 3).toLowerCase(),
          passphrase: this.passphrase,
        };
        this.callback(payload).then(() => {
          this.$refs.passphraseText.reset();
          this.dialog = false;
        });
      },
    },
    data() {
      return {
        dialog: false,
        answer: null,
        answers: [
          '',
          'Yes',
          'No',
          'Abstention',
        ],
        proposal: null,
        passphrase: null,
        passphraseRules: [
          v => !!v || 'Passphrase is required',
        ],
      };
    },
  };
</script>
