<template>
  <div class="ProposalListItemDetail">
    <div class="code">{{ item.code }}</div>
    <h2 class="title">{{ item.title }}</h2>
    <span class="time" v-if="remainTime">{{ remainTime }}</span>
    <hr>
    <div class="contract">{{ item.content }}</div>
  </div>
</template>

<script>
  export default {
    name: 'bos-wallet-proposal-item',
    props: ['item', 'vote'],
    methods: {
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
</style>
