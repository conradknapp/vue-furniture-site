<template lang="pug">
  v-alert(:icon="icon" dark :color="color" dismissible @input="onClose" :class="{ 'hide' : hideAlert }" :value="true")
    h3.text-xs-center {{text}}
    h4.text-xs-center {{submessage}}
</template>

<script>
  export default {
    props: ['text', 'submessage', 'icon', 'color'],
    data() {
      return {
        hideAlert: false
      }
    },
    methods: {
      onClose() {
        this.hideAlert = !this.hideAlert
        setTimeout(() => this.$emit('dismissed'), 1000);
      }
    }
  }
</script>

<style>
  .hide {
    animation: hideAlert 1s forwards;
  }

  @keyframes hideAlert {
    0% {
      transform: translateX(-20%);
    }
    100% {
      opacity: 0;
      transform: translateX(100%);
    }
  }
</style>
