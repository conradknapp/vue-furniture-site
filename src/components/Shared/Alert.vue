<template lang="pug">
  v-alert(:icon="icon" dark :color="color" dismissible @input="onClose" :value="true")
    h3.text-xs-center {{text}}
    h4.text-xs-center {{submessage}}
</template>

<script>
export default {
  props: ['text', 'submessage', 'icon', 'color'],
  data() {
    return {
      flag: true,
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
      this.$emit('dismissed')
    }
  }
}
</script>