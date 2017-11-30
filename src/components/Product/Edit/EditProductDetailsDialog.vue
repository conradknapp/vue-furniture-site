<template lang="pug">
  v-dialog(width="350px" persistent v-model="editDialog")
    v-btn(floating accent slot="activator")
      v-icon edit
    v-card
      v-container
        v-layout(row wrap)
          v-flex(xs12)
            v-card-title Edit Product
        v-divider
        v-layout(row wrap)
          v-flex(xs12)
            v-card-text
              v-text-field(name="title" label="Title" id="title" v-model="editedTitle" required)
              v-text-field(name="description" label="Description" id="description" v-model="editedDescription" multi-line required)
        v-layout(row wrap)
          v-flex(xs12)
            v-card-actions
              v-btn(flat @click="editDialog = false").blue---text Close
              v-btn(flat @click="onSaveChanges").red--text Save
</template>

<script>
export default {
  props: ['product'],
  data() {
    return {
      editDialog: false,
      editedTitle: this.product.title,
      editedDescription: this.product.description
    }
  },
  methods: {
    onSaveChanges() {
      if (this.editedTitle.trim() === '' || this.editedDescription.trim() === '')
      this.editDialog = false
      this.$store.dispatch('updateProductData', {
        id: this.product.id, 
        title: this.editedTitle,
        description: this.editedDescription
      })
    }
  }
}
</script>
