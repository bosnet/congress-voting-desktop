<template>
  <div class="SettingsRecoveryKey">
    <div class="SettingsRecoveryKeyBody">
      <h2>{{$t('recovery key')}}</h2>
      <span>{{$t('please keep your recovery key safely')}}</span>
      <img :src="icon" />
    </div>
  </div>
</template>

<script>
  import RecoverKeyIcon from '../../../assets/svg/import-method-recovery-key.svg';
  import RecoverKeyOnIcon from '../../../assets/svg/import-method-recovery-key-on.svg';

  export default {
    name: 'wallet-settings-editaccount',
    props: ['address'],
    components: {
    },
    data() {
      return {
        icon: RecoverKeyIcon,
        iconOn: RecoverKeyOnIcon,
      };
    },
    computed: {
    },
    watch: {
    },
    methods: {
    },
  };
</script>

<style>
  .SettingsRecoveryKey {

  }

  .SettingsRecoveryKeyBody {
    background-color: #fff;
    padding: 50px;
  }

  .SettingsRecoveryKeyBody h3 {
    font-size: 30px;
    font-weight: bold;
    color: #333333;
  }
</style>
