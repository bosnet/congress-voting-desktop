<template>
  <section class="ProposalList">
    <div class="ProposalTabs">
      <ul class="ProposalTabsList">
        <li :class="tabClasses('now')" @click="setTab('now')">{{$t('ongoing voting')}}</li>
        <li :class="tabClasses('past')" @click="setTab('past')">{{$t('closed voting')}}</li>
      </ul>
    </div>
    <div class="ProposalContent">
      <div v-if="!currentProposal">
        <bos-wallet-proposal-item
          :vote="openDialog"
          @show="showDetail"
          :item="p"
          v-for="p in list"/>
      </div>
      <bos-wallet-proposal-item-detail :item="currentProposal" v-else />
    </div>
  </section>
</template>

<script>
  import VoteDialog from './VoteDialog';

  export default {
    name: 'bos-wallet-proposal-list',
    props: ['wallet'],
    components: {
      VoteDialog,
    },
    data() {
      return {
        activeMenu: 'now',
        currentProposal: null,
      };
    },
    methods: {
      tabClasses(test) {
        return {
          'proposal-tabs-list-item': true,
          'proposal-tabs-list-item--on': this.active(test),
        };
      },
      active(test) {
        return this.activeMenu === test;
      },
      setTab(menu) {
        this.activeMenu = menu;
        this.currentProposal = null;
      },
      showDetail(proposal) {
        this.currentProposal = proposal;
      },
      openDialog(proposal) {
        this.$refs.voteDialog.open(proposal);
      },
      vote({ proposalId, answer, passphrase }) {
        return this.$store.dispatch('vote', {
          address: this.wallet.address,
          proposalId,
          answer,
          passphrase,
        });
      },
    },
    computed: {
      list() {
        if (this.proposals) {
          return this.proposals.filter((p) => {
            if (this.activeMenu === 'now') {
              return p.state !== 'closed';
            }
            return p.state === 'closed';
          });
        }
        return null;
      },
    },
    asyncComputed: {
      proposals() {
        return this.$store.getters.getProposals();
      },
    },
  };
</script>

<style>
  .ProposalList {
    height: 615px;
    overflow-y: auto;
  }

  .ProposalTabs {
    height: 45px;
    padding: 0 20px;
    background-color: #fff;
  }

  .ProposalTabsList {
    list-style: none;
    padding: 0;
    height: 45px;
    display: flex;
  }

  .proposal-tabs-list-item {
    margin: 0 10px;
    font-size: 13px;
    color: #607481;
    height: 100%;
    display: flex;
    align-items: center;
    cursor: pointer;
    border-bottom: 2px solid #ffffff;
  }

  .proposal-tabs-list-item--on,
  .proposal-tabs-list-item:hover {
    color: #3c92e4;
    border-bottom: 2px solid #3c92e4;;
  }

  .ProposalContent {
    padding: 15px 25px;
  }
</style>
