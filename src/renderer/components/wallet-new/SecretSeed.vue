<template>
  <div class="NewSecretSeed">
    <h1>{{$t('entering secret seed title')}}</h1>
    <div class="content">
      <v-text-field
          :label="$t('enter your secret seed')"
          :rules="[rules.check]"
          autofocus
          ref="secretSeed"
      >
        <img :src="successIcon" slot="append" alt="success" v-if="success"/>
        <img :src="errorIcon" slot="append" alt="error" v-if="failed"/>
      </v-text-field>
    </div>
  </div>
</template>

<script>
  import Wallet from '@/lib/wallet';
  import successIcon from '../../assets/svg/input-success.svg';
  import errorIcon from '../../assets/svg/input-error.svg';

  export default {
    name: 'wallet-import-secret-seed',
    props: ['passed'],
    data() {
      return {
        successIcon,
        errorIcon,
        success: false,
        failed: false,
        rules: {
          check: (seed) => {
            if (!seed) { return true; }

            try {
              Wallet.parsePubKey(seed);
              this.$data.failed = false;
              this.$data.success = true;
              this.$emit('enable-next');
              return true;
            } catch (e) {
              this.$data.success = false;
              this.$data.failed = true;
              this.$emit('disable-next');
              return this.$t('the secret seed is wrong');
            }
          },
        },
      };
    },
    methods: {
      seed() {
        return this.$refs.secretSeed.internalValue;
      },
    },
  };
</script>

<style>
  .NewSecretSeed .v-input {
    width: 400px;
    margin: 0 auto;
  }

  .NewSecretSeed .content {
    padding-top: 75px;
  }
</style>
