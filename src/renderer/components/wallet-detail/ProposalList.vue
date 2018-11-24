<template>
  <section class="ProposalList">
    <div class="ProposalTabs">
      <ul class="ProposalTabsList">
        <li :class="tabClasses('now')" @click="setTab('now')">{{$t('ongoing voting')}}</li>
        <li :class="tabClasses('past')" @click="setTab('past')">{{$t('closed voting')}}</li>
      </ul>
    </div>
    <div class="ProposalContentEmpty" v-if="!list || list.length === 0">
      <div v-if="active('now')">{{$t('there is no ongoing congress voting')}}</div>
      <div v-else>{{$t('there is no closed congress voting')}}</div>
    </div>
    <div class="ProposalContent" v-else >
      <div v-if="!currentProposal">
        <bos-wallet-proposal-item
          @show="showDetail"
          :item="p"
          :wallet="wallet"
          v-for="p in list"/>
      </div>
      <bos-wallet-proposal-item-detail :item="currentProposal" :wallet="wallet" v-else />
    </div>
  </section>
</template>

<script>
  export default {
    name: 'bos-wallet-proposal-list',
    props: ['wallet'],
    data() {
      return {
        activeMenu: 'now',
        currentProposal: null,
        proposals: null,
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
      async refreshProposals() {
        this.proposals = await this.$store.getters.getProposals();
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
    mounted() {
      this.$root.$on('tick', this.refreshProposals);
      this.refreshProposals();
    },
    destroyed() {
      this.$root.$off('tick', this.refreshProposals);
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

  .ProposalContentEmpty {
    height: 100%;
    font-size: 14px;
    color: #728395;
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
