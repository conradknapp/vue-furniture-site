<template lang="pug">
    v-container
      v-layout(row wrap v-if="error && !loading")
        v-flex(xs12)
          app-alert.mt-5(@dismissed="onDismissed" :icon="error.icon" :color="error.color" :submessage="error.submessage" :text="error.message")
      v-layout(row wrap)
        v-flex(xs12 class="text-xs-center")
          v-btn(large router dark class="deep-purple darken-2" to="/products") See All Products
      v-layout
        v-flex(xs12).text-xs-center
          v-progress-circular(indeterminate color="purple" :width="7" :size="70" v-if="loading").pt-5
      v-layout(row wrap v-if="!loading")
        v-flex(xs12)
          v-carousel(v-bind="{ 'cycle': cycleStop }" interval="3000" lazy style="cursor: pointer;" delimiter-icon="home" hide-controls)
            v-carousel-item(@mouseover="stopCarousel" @mouseout="startCarousel" v-for="product in products" :src="product.imageUrl" :key="product.id" @click="onLoadProduct(product.id)")
              h1.title {{product.title}}
      v-layout(row wrap)
        v-flex(xs12)
          .bg
          .bg.bg2
          .bg.bg3
          .content
            v-flex(xs12 sm6 offset-sm3)
              v-card(color="orange lighten-2")
                v-card-text
                  v-container
                    form(@submit.prevent="onSignup")
                      v-layout(row)
                        v-flex(xs12)
                          v-text-field(name="email" label="Email" id="email" v-model="email" type="email" prepend-icon="email" required)
                      v-layout(row)
                        v-flex(xs12)
                          v-text-field(name="password" label="Password" id="password" v-model="password" 
                          prepend-icon="extension" type="password" required)
                      v-layout(row)
                        v-flex(xs12)
                          v-text-field(name="confirmPassword" label="Confirm Password" id="confirmPassword" v-model="confirmPassword" type="password" prepend-icon="gavel" :rules="[comparePasswords]" required)
                      v-layout(row).text-sm-center
                        v-flex(xs12)
                          v-btn(color="blue" dark type="submit" :disabled='loading' :loading="loading") Submit
                            span(slot="loader").custom-loader
                              v-icon(light) cached
</template>

<script>
export default {
  data() {
    return {
      cycleStop: true
    }
  },
  computed: {
    error() {
      return this.$store.getters.error
    },
    products() {
      return this.$store.getters.featuredProducts.sort(() => {
        return .5 - Math.random()
      })
    },
    loading() {
      return this.$store.getters.loading
    }
  },
  created() {
    setTimeout(() => {
      this.$store.dispatch('clearError')
    }, 5000)
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
    },
    onDismissed() {
      this.$store.dispatch('clearError')
    }
  }
}


// Save your favorites (heart animation)

// Find furniture your love

// Beautify your home (home animation)
</script>

<style>
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
  
  .bg {
    animation:slide 3s ease-in-out infinite alternate;
    background-image: linear-gradient(-60deg, #dcf 50%, #99f 50%);
    left: -50%;
    opacity: 0.5;
    position: absolute;
    right: -50%;
    top: 100%;
    z-index: 2;
    height: 500px;
  }

  .bg2 {
    animation-direction:alternate-reverse;
    animation-duration:4.8s;
  }

  .bg3 {
    animation-duration:6.2s;
  }

  @keyframes slide {
    0% {
      transform:translateX(-25%);
    }
    100% {
      transform:translateX(25%);
    }
  }

  .content {
    width: 100%;
    padding-top: 60px;
    top: 100%;
    left: 0;
    right: 0;
    bottom: 0;
    position: absolute;
    z-index: 5;
  }
</style>