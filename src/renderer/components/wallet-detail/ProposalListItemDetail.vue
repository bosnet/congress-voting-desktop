<template>
  <div class="ProposalListItemDetail">
    <div class="code">{{ item.code }}</div>
    <h2 class="title">{{ item.title }}</h2>
    <span class="time" v-if="remainTime">{{ remainTime }}</span>
    <div class="btns" v-if="votable">
      <button class="btn agree" @click="openPassphraseDialog('yes')">{{$t('agree')}}</button>
      <button class="btn disagree" @click="openPassphraseDialog('no')">{{$t('disagree')}}</button>
      <button class="btn abstain" @click="openPassphraseDialog('abs')">{{$t('abstain')}}</button>
    </div>
    <hr>
    <div class="contract">{{ item.content }}</div>
    <bos-passphrase-dialog ref="passphraseDialog"/>
    <bos-toast v-model="showMessage" :timeout="2500">{{message}}</bos-toast>
  </div>
</template>

<script>
  export default {
    name: 'bos-wallet-proposal-item',
    props: ['item', 'wallet'],
    data() {
      return {
        answer: null,
        showMessage: false,
        message: '',
      };
    },
    methods: {
      openPassphraseDialog(answer) {
        this.answer = answer;
        this.$refs.passphraseDialog.open({
          confirmCallback: this.vote,
        });
      },
      async vote({ passphrase }) {
        try {
          await this.$store.dispatch('vote', {
            address: this.wallet.address,
            proposalId: this.item.id,
            answer: this.answer,
            passphrase,
          });
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
    },
    computed: {
      remainTime() {
        if (this.item.remain) {
          const now = new Date();
          const until = new Date();
          until.setSeconds(until.getSeconds() + (this.item.remain * 5));
          const diff = new Date(until.getTime() - now.getTime());
          const time = `${diff.getUTCHours()}:${diff.getUTCMinutes()}:${diff.getUTCSeconds()}`;

          if (diff.getUTCDate() - 1 > 0) {
            if (this.item.state === 'opened') {
              return this.$t('voting remained more than a day', {
                day: diff.getUTCDate() - 1,
                time,
              });
            } else if (this.item.state === 'open-before') {
              return this.$t('voting start in more than a day', {
                day: diff.getUTCDate() - 1,
                time,
              });
            }
          }

          if (this.item.state === 'opened') {
            return this.$t('voting remained less than a day', {
              time,
            });
          } else if (this.item.state === 'open-before') {
            return this.$t('voting start in less than a day', {
              day: diff.getUTCDate() - 1,
              time,
            });
          }
        }
        return null;
      },
      votable() {
        return this.item.state === 'opened';
      },
    },
  };
</script>

<style>
  .ProposalListItemDetail {
    width: 100%;
    border-radius: 2px;
    background-color: #ffffff;
    margin: 5px;
    padding: 30px 40px;
    position: relative;
  }

  .ProposalListItemDetail .code {
    font-size: 12px;
    color: #1792f0;
  }

  .ProposalListItemDetail .time {
    font-size: 11px;
    text-align: right;
    color: #728395;
    position: absolute;
    top: 30px;
    right: 40px;
  }

  .ProposalListItemDetail .time:before {
    content: "";
    width: 12px;
    height: 12px;
    display: inline-block;
    vertical-align: middle;
    margin-right: 5px;
    margin-top: -2px;
    background: url(../../assets/svg/proposal-clock.svg);
  }

  .ProposalListItemDetail .title {
    margin-top: 30px;
  }

  .ProposalListItemDetail hr {
    width: 100%;
    height: 1px;
    background-color: #c4d1d6;
    margin: 40px 0;
    border: none;
  }

  .ProposalListItemDetail .contract {
    white-space: pre-wrap;
    word-wrap: break-word;
    font-family: inherit;
  }

  .ProposalListItemDetail .btns {
    text-align: center;
    margin-top: 40px;
  }

  .ProposalListItemDetail .btn {
    width: 150px;
    height: 45px;
    margin: 0 5px;
    border-radius: 2px;
    background-color: #ffffff;
    font-size: 15px;
  }

  .ProposalListItemDetail .btn.agree {
    color: #1792f0;
    border: 1px solid #1792f0;
  }

  .ProposalListItemDetail .btn.agree:hover {
    box-shadow: 0 5px 13px 0 #cde6ff;
  }

  .ProposalListItemDetail .btn.agree:active {
    border-color: #3da4f3;
    background-color: #3da4f3;
    color: #ffffff;
  }

  .ProposalListItemDetail .btn.disagree {
    color: #ed6060;
    border: 1px solid #ed6060;
  }

  .ProposalListItemDetail .btn.disagree:hover {
    box-shadow: 0 5px 13px 0 #ffd6d7;
  }

  .ProposalListItemDetail .btn.disagree:active {
    border-color: #ed6060;
    background-color: #ed6060;
    color: #ffffff;
  }

  .ProposalListItemDetail .btn.abstain,
  .ProposalListItemDetail .btn.edit {
    color: #728395;
    border: 1px solid #728395;
  }

  .ProposalListItemDetail .btn.abstain:hover,
  .ProposalListItemDetail .btn.edit:hover {
    box-shadow: 0 5px 13px 0 #d6e0ea;
  }

  .ProposalListItemDetail .btn.abstain:active,
  .ProposalListItemDetail .btn.edit:active {
    border-color: #728395;
    background-color: #728395;
    color: #ffffff;
  }
</style>
