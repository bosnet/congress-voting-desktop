<template>
  <aside class="Sidebar">
    <header>
      <img :src="logo" alt="BOScoin"/>
    </header>
    <nav>
      <ul>
        <li :class="{account: true, on: activeMenu === 'account'}">
          <router-link :to="`/wallet/${address}/#account-frozen`">Account</router-link>
        </li>
        <li :class="{voting: true, on: activeMenu === 'voting'}">
          <router-link :to="`/wallet/${address}/#voting`">Congress Voting</router-link>
        </li>
      </ul>
    </nav>
    <footer>
      <ul>
        <li :class="{setting: true, on: activeMenu === 'settings'}">
          <router-link :to="`/wallet/${address}/#settings-account`">Settings</router-link>
        </li>
        <li class="home">
          <router-link to="/">Home</router-link>
        </li>
      </ul>
    </footer>
  </aside>
</template>

<script>
  import logo from '@/assets/svg/logo.svg';

  export default {
    name: 'bos-wallet-sidebar',
    props: ['activeMenu', 'wallet'],
    data() {
      return {
        logo,
        address: this.wallet.address,
        showMenu: false,
      };
    },
  };
</script>

<style>
  .Sidebar {
    width: 158px;
    height: 100%;
    background-color: #394878;
    font-size: 13px;
    color: #6e96d2;
    position: absolute;
  }

  .Sidebar header {
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-bottom: 1px solid #576694;
  }

  .Sidebar ul {
    list-style: none;
    color: #6e96d2;
    font-size: 13px;
    padding: 0;
  }

  .Sidebar li {
    width: 100%;
    height: 45px;
    cursor: pointer;
  }

  .Sidebar li:hover,
  .Sidebar li:active {
    background-color: #314070;
  }

  .Sidebar li.on {
    color: #fff;
    background-color: #283766;
  }

  .Sidebar li a {
    width: 100%;
    height: 100%;
    display: inline-block;
    text-decoration: none;
    color: #6e96d2;
    display: flex;
    align-items: center;
  }

  .Sidebar li.on a {
    color: #fff;
  }

  .Sidebar li a:before {
    content: "";
    display: inline-block;
    width: 17px;
    height: 17px;
    background-size: 17px 17px;
    margin-left: 15px;
    margin-right: 7px;
    vertical-align: top;
  }

  .Sidebar nav li.account a:before,
  .Sidebar nav li.account:active a:before {
    background: url(../../assets/svg/nav-account.svg);
  }

  .Sidebar nav li.account.on a:before {
    background: url(../../assets/svg/nav-account-on.svg);
  }

  .Sidebar nav li.voting a:before,
  .Sidebar nav li.voting:active a:before {
    background: url(../../assets/svg/navi-voting.svg);
  }

  .Sidebar nav li.voting.on a:before {
    background: url(../../assets/svg/navi-voting-on.svg);
  }

  .Sidebar footer {
    position: absolute;
    bottom: 10px;
    width: 100%;
  }

  .Sidebar footer li {
    height: 40px;
  }

  .Sidebar footer li.setting a:before,
  .Sidebar footer li.setting:active a:before {
    background: url(../../assets/svg/navi-settings.svg);
  }

  .Sidebar footer li.setting.on a:before {
    background: url(../../assets/svg/navi-settings-on.svg);
  }

  .Sidebar footer li.home a:before,
  .Sidebar footer li.home:active a:before {
    background: url(../../assets/svg/navi-home.svg);
  }

  .Sidebar footer li.home.on a:before {
    background: url(../../assets/svg/navi-home-on.svg);
  }

  .Sidebar footer li.setting .v-menu {
    width: 100%;
    height: 100%;
    display: flex;
  }

  .Sidebar footer li.setting .v-menu div {
    width: 100%;
    height: 100%;
  }
</style>
