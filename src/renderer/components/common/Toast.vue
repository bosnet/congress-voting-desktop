<template>
  <transition name="bos-toast-transition">
    <div :class="{'bos-toast': true, 'bos-toast--pull-right': pullRight}" v-show="value">
      <span :class="classes">
        <slot/>
      </span>
    </div>
  </transition>
</template>

<script>
  export default {
    name: 'bos-toast',
    props: {
      value: Boolean,
      warn: {
        type: Boolean,
        default: true,
      },
      timeout: {
        type: Number,
        default: 2000,
      },
      pullRight: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {
        timer: -1,
      };
    },
    watch: {
      value() {
        this.setTimeout();
      },
    },
    mounted() {
      this.setTimeout();
    },
    methods: {
      setTimeout() {
        clearTimeout(this.timer);
        if (this.value) {
          this.timer = setTimeout(() => this.$emit('input', false), this.timeout);
        }
      },
    },
    computed: {
      classes() {
        return {
          'bos-toast--warn': this.warn,
        };
      },
    },
  };
</script>

<style>
  .bos-toast {
    position: fixed;
    bottom: 47px;
    left: 0;
    width: 100%;
    text-align: center;
    color: #ffffff;
  }

  .bos-toast--warn {
    height: 30px;
    display: inline-block;
    border-radius: 15px;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.34);
    background-color: #353a3f;
    padding: 5px 30px;
    font-size: 13px;
    color: #ffffff;
  }

  .bos-toast--pull-right {
    left: 79px
  }

  .bos-toast-transition-enter-active {
    animation: bos-toast-slide-in .2s;
  }
  .bos-toast-transition-leave-active {
    animation: bos-toast-slide-in .2s reverse;
  }

  @keyframes bos-toast-slide-in {
    0% {
      transform: translateY(30px);
      opacity: 0;
    }
    100% {
      transform: translateY(0);
      opacity: 1;
    }
  }
</style>
