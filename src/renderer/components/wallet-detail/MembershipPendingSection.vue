<template>
  <section class="PreMembershipPending">
    <div>
      <img :src="membershipPendingImg" />
      <h2>{{$t('identity verification is in progress')}}</h2>
      <hr>
      <span>{{$t('identity verification could take hours')}}</span>
    </div>
  </section>
</template>

<script>
  import membershipPendingImg from '../../assets/svg/membership-pending.svg';

  export default {
    name: 'wallet-membership-pending-section',
    props: ['wallet'],
    data() {
      return {
        membershipPendingImg,
      };
    },
    mounted() {
      this.$store.state.App.ga.send('screenview', { cd: 'wallet-membership-pending-section' });
    },
  };
</script>

<style>
  .PreMembershipPending {
    padding: 120px;
    text-align: center;
    height: 100%;
    overflow-y: auto;
  }

  .PreMembershipPending img {
    margin: 0 auto 20px;
    display: block;
  }

  .PreMembershipPending h2 {
    font-size: 25px;
    font-weight: bold;
    color: #728395;
    text-align: center;
    width: 400px;
    word-break: keep-all;
    margin: 0 auto 15px;
  }

  .PreMembershipPending hr {
    width: 120px;
    height: 1px;
    background-color: #c4d1d6;
    margin: 0 auto;
    border: none;
  }

  .PreMembershipPending span {
    width: 100%;
    display: block;
    font-size: 14px;
    color: #728395;
    text-align: center;
    word-break: keep-all;
    margin: 0 auto;
    width: 500px;
    line-height: 30px;
    margin-top: 10px;
  }
</style>
