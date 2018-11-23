<template>
  <div :class="['ProposalListItem', imminent]" class="" @click="$emit('show', item)">
    <div class="code">{{ item.code }}</div>
    <h4 class="title">{{ item.title }}</h4>
    <span class="time" v-if="remainTime">{{ remainTime }}</span>
    <span :class="['result', result]" v-if="result">{{ $t(result) }}</span>
  </div>
</template>

<script>
  export default {
    name: 'bos-wallet-proposal-item',
    props: ['item', 'wallet'],
    computed: {
      imminent() {
        // 17280 => block for 1 day = 60 * 60 * 24 / 5
        if (this.item.state === 'opened' && this.item.remain < 17280) {
          return 'imminent';
        }
        return null;
      },
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
      result() {
        if (this.item.state === 'closed') {
          if (this.item.result_final) {
            return this.item.result_final;
          }
          return 'counting';
        }
        return null;
      },
    },
  };
</script>

<style>
  .ProposalListItem {
    width: 322px;
    height: 230px;
    border-radius: 2px;
    background-color: #ffffff;
    display: inline-block;
    margin: 5px;
    padding: 30px 20px;
    position: relative;
    cursor: pointer;
  }

  .ProposalListItem:hover,
  .ProposalListItem:active {
    box-shadow: 0 10px 25px 0 rgba(193, 217, 240, 0.87);
  }

  .ProposalListItem .code {
    font-size: 12px;
    color: #728395;
  }

  .ProposalListItem .title {
    font-size: 16px;
    font-weight: normal;
    color: #000000;
    margin-top: 15px;
  }

  .ProposalListItem .time {
    font-size: 11px;
    text-align: right;
    color: #728395;
    right: 20px;
    bottom: 20px;
    position: absolute;
    display: inline-block;
  }

  .ProposalListItem .time:before {
    content: "";
    width: 12px;
    height: 12px;
    display: inline-block;
    vertical-align: middle;
    margin-right: 5px;
    margin-top: -2px;
    background: url(../../assets/svg/proposal-clock.svg);
  }

  .ProposalListItem:hover .code,
  .ProposalListItem:active .code {
    color: #1792f0;
  }

  .ProposalListItem.imminent .time {
    color: #ec1f1f;
  }

  .ProposalListItem.imminent .time:before {
    background: url(../../assets/svg/proposal-clock-highlight.svg);
  }

  .ProposalListItem .result {
    right: 20px;
    bottom: 20px;
    position: absolute;
    font-size: 12px;
    font-weight: bold;
    letter-spacing: 0.5px;
    padding-bottom: 2px;
  }

  .ProposalListItem .result.counting {
    color: #000000;
    border-bottom: 1px solid #000000;
  }

  .ProposalListItem .result.passed {
    color: #1792f0;
    border-bottom: 1px solid #1792f0;
  }

  .ProposalListItem .result.rejected {
    color: #ed6060;
    border-bottom: 1px solid #ed6060;
  }
</style>
