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
        flag: true,
        hideAlert: false
        // hourglass: ''
      }
    },
    // created() {
    //   setInterval(() => {
    //     this.flag = !this.flag
    //     return this.flag ? this.hourglass = 'hourglass_empty' : this.hourglass = 'hourglass_full'
    //   }, 1000)
    // },
    methods: {
      onClose() {
        if (this.hideAlert === true) {
          this.hideAlert = false;
        } else {
          this.hideAlert = true;
        }
        setTimeout(() => this.$emit('dismissed'), 1500);
      },
      // toggleClass() {
      //   if (this.hide === true) {
      //     this.hide = false;
      //   } else {
      //     this.hide = true;
      //   }
      // }
    }
  }
</script>

<style>
  .hide {
    transition: all .5s;
    opacity: 0;
    visibility: hidden;
    animation: hideMsgAlert 1s;
  }

  @keyframes hideMsgAlert {
    0% {
      opacity: 1;
      transform: translateX(-20%);
    }
    100% {
      opacity: 0;
      transform: translateX(100%);
    }
  }
</style>
