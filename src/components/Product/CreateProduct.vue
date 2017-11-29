<template lang="pug">
  v-container
    v-layout(row)
      v-flex(xs12 class="text-xs-center")
        h1.primary--text Add a new product
    v-layout(row)
      v-flex(xs12)
        form(@submit.prevent="onCreateProduct")
          v-layout(row)
            v-flex(xs12 sm6 offset-sm3)
              v-text-field(name="title" label="Title" id="title" v-model="title" required)
          v-layout(row)
            v-flex(xs12 sm6 offset-sm3)
              v-select(name="categories" label="Categories" id="categories" :items="['Mid-Century Modern', 'Rustic', 'Preppy', 'Traditional', 'Arts & Crafts']" v-model="categories" multiple required)
          v-layout(row)
            v-flex(xs12 sm6 offset-sm3)
              v-text-field(name="imageUrl" label="Image URL" id="image-url" v-model="imageUrl" required)
          v-layout(row)
            v-flex(xs12 sm6 offset-sm3)
              img(:src="imageUrl" height="300px")
          v-layout(row)
            v-flex(xs12 sm6 offset-sm3)
              v-text-field(name="description" label="Description" id="description" v-model="description" multi-line required)
          v-layout(row)
            v-flex(xs12 sm6 offset-sm3)
              v-text-field(label="Link Title" v-model="linkTitle" id="linkTitle")
          v-layout(row)
            v-flex(xs12 sm6 offset-sm3)
              v-text-field(label="Link Url" v-model="linkUrl" id="linkUrl")
          v-layout(row)
            v-flex(xs12 sm6 offset-sm3)
              v-btn(@click="addLinkObj") Add Link
              p(v-for="link in links") {{ link.linkTitle}} - {{link.linkUrl}}
          v-layout(row)
            v-flex(xs12 sm6 offset-sm3)
              v-btn(color="primary" :disabled="!formIsValid" type="submit") Create Product
</template>

<script>
export default {
  data() {
    return {
      title: '',
      categories: '',
      imageUrl: '',
      description: '',
      linkTitle: '',
      linkUrl: '',
      links: []
    }
  },
  computed: {
    formIsValid() {
      return this.title !== '' &&
      this.categories !== '' &&
      this.imageUrl !== '' &&
      this.description !== '' &&
      this.links !== ''
    }
  },
  methods: {
    onCreateProduct() {
      if (!this.formIsValid) {
        return
      }
      const productData = {
        title: this.title,
        categories: this.categories,
        links: this.links,
        imageUrl: this.imageUrl,
        description: this.description,
        date: new Date()
      }
      this.$store.dispatch('createProduct', productData)
      this.$router.push('/products')
    },
    addLinkObj() {
      let linkObj = {
        linkTitle: this.linkTitle,
        linkUrl: this.linkUrl
      };
      this.links.push(linkObj);
      this.linkTitle = '';
      this.linkUrl = '';
    }
  }
}
</script>
