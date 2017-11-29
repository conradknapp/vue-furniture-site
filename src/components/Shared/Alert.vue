<template lang="pug">
  v-alert(icon="error" dismissible @input="onClose" :value="true")
    h3 {{text}}
</template>

<script>
export default {
  props: ['text'],
  methods: {
    onClose() {
      this.$emit('dismissed')
    }
  }
}
</script>
