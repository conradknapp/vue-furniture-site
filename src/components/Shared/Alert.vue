<template lang="pug">
  v-alert(:icon="hourglass" dark color="yellow darken-3" dismissible @input="onClose" :value="true")
    h3.text-sm-center {{text}}
    h4.text-sm-center {{submessage}}
</template>

<script>
export default {
  props: ['text', 'submessage'],
  data() {
    return {
      flag: true,
      hourglass: ''
    }
  },
  created() {
    setInterval(() => {
      this.flag = !this.flag
      return this.flag ? this.hourglass = 'hourglass_empty' : this.hourglass = 'hourglass_full'
    }, 1000)
  },
  methods: {
    onClose() {
      this.$emit('dismissed')
    }
  }
}
</script>