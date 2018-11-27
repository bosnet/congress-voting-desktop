<template>
  <v-container class="Shutdown">
    <div>
      <img :src="shutdownImg">
      <h1>{{$t('maintainance in progress')}}</h1>
    </div>
  </v-container>
</template>

<script>
  import shutdownImg from '../../assets/svg/shutdown.svg';

  export default {
    name: 'shutdown-page',
    data() {
      return {
        shutdownImg,
      };
    },
  };
</script>

<style>
  .Shutdown {
    background-color: #eaf0f7;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
  }

  .Shutdown h1 {
    margin-top: 20px;
    font-size: 23px;
    font-weight: bold;
    color: #869aae;
  }
</style>
