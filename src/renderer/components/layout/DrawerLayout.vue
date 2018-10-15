<template>
  <v-app>
    <v-navigation-drawer
        width="200"
        mobileBreakPoint="1024"
        persistent
        :mini-variant="miniVariant"
        v-model="drawer"
        fixed
        app
        v-show="drawer"
    >
      <v-toolbar flat class="transparent" dense>
        <v-list class="pa-0" :class="{'list-border-bottom' : miniVariant}">
          <v-list-tile>
            <v-list-tile-content v-if="!miniVariant">
              <v-list-tile-title>
                <h2 v-text=""></h2>
              </v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-toolbar>

      <v-divider></v-divider>

      <v-tooltip right :disabled="!miniVariant">
        <v-toolbar flat class="transparent" dense slot="activator">
          <v-list class="pa-0" :class="{'list-border-bottom' : miniVariant}">
            <v-list-tile to="/" exact>
              <v-list-tile-action>
                <v-icon>home</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title class="body-1">{{$t('wallet-list')}}</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list>
        </v-toolbar>
        <span>{{$t('wallet-list')}}</span>
      </v-tooltip>

      <v-divider v-show="sideLinks.length > 0"/>

      <v-list subheader :class="{'list-border-bottom' : miniVariant}" v-show="sideLinks.length > 0">
        <template v-for="item in sideLinks">
          <v-tooltip right :disabled="!miniVariant">
            <v-list-tile :key="item.icon" :to="item.link" exact slot="activator"
            >
              <v-list-tile-action>
                <v-icon v-html="item.icon"/>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title v-text="item.title"/>
              </v-list-tile-content>
            </v-list-tile>
            <span v-text="item.title"/>
          </v-tooltip>
        </template>
      </v-list>

      <v-divider v-show="sideLinks.length > 0"></v-divider>
    </v-navigation-drawer>

    <v-content>
      <router-view/>
    </v-content>
  </v-app>
</template>

<script>
  export default {
    name: 'drawer-layout',
    data() {
      return {
        drawer: false,
        fixed: true,
        miniVariant: true,
        tabs: null,
        items: [],
        timer: null,
      };
    },
    created() {
      this.timer = setInterval(() => this.$root.$emit('tick'), 10000);
    },
    destroyed() {
      clearInterval(this.timer);
    },
    computed: {
      sideLinks() {
        return this.$store.state.Layout.sideLinks;
      },
      requestErrors() {
        return this.$store.state.Layout.requestErrors;
      },
    },
  };
</script>

<style>
</style>
