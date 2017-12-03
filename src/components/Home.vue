<template lang="pug">
  v-container
    v-layout(row wrap)
      v-flex(xs12 class="text-xs-center")
        v-btn(large router dark class="deep-purple darken-2" to="/products") See All Products
    v-layout
      v-flex(xs12).text-xs-center
        v-progress-circular(indeterminate color="purple" :width="7" :size="70" v-if="loading")
    v-layout(row wrap v-if="!loading")
      v-flex(xs12)
        v-carousel(v-bind="{ 'cycle': cycleStop }" interval="3000" lazy style="cursor: pointer;" delimiter-icon="home" hide-controls)
          v-carousel-item(@mouseover="stopCarousel" @mouseout="startCarousel" v-for="product in products" :src="product.imageUrl" :key="product.id" @click="onLoadProduct(product.id)")
            h1.title {{product.title}}
</template>

<script>
export default {
  data() {
    return {
      cycleStop: true
    }
  },
  computed: {
    products() {
      return this.$store.getters.featuredProducts
    },
    loading() {
      return this.$store.getters.loading
    }
  },
  methods: {
    onLoadProduct(id) {
      this.$router.push('/products/' + id)
    },
    stopCarousel() {
      this.cycleStop = !this.cycleStop
    },
    startCarousel() {
      this.cycleStop = !this.cycleStop
    }
  }
}
</script>

<style scoped>
  .title {
    position: absolute;
    bottom: 50px;
    background-color: rgba(0,0,0,0.5);
    color: white;
    font-family: sans-serif;
    font-weight: 100;
    padding: 2.5rem;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
  }

  .title:hover {
    color: orchid;
  }

  #carousel {
    animation-play-state: paused
  }
</style>
