<template lang="pug">
v-container(fluid grid-list-md class="text-xs-center")
  v-layout(row wrap v-if="error && !loading")
    v-flex(xs12)
      app-alert(v-if="!isSignUpAlert" @dismissed="onDismissed" :icon="error.icon" :color="error.color" :submessage="error.submessage" :text="error.message" class="Alert")
  v-layout(row wrap v-if="!loading" class="mt-5")
    v-flex(xs12)
      v-btn(large dark transition @click="reload" class="darken-4 purple") See All Products
  v-layout
    v-flex(xs12)
      v-progress-circular(indeterminate color="purple" :width="7" :size="70" v-if="loading")
  v-layout(row wrap v-if="!loading")
    v-flex(xs12)
      v-carousel(v-bind="{ 'cycle': cycleCarousel }" interval="3000" style="cursor: pointer; animation-play-state: paused;" delimiter-icon="home" hide-controls lazy)
        v-carousel-item(@mouseover="toggleCarousel" @mouseout="toggleCarousel" v-for="product in products" :src="product.imageUrl" :key="product.id" @click="onLoadProduct(product.id)")
          h1(class="Carousel__Title") {{product.title}}
      v-container
        v-layout(row wrap v-if="!error")
          v-flex(xs12 sm6 offset-sm3)
            h1 Let's Get Started
            h3 Sign up to save your favorites
        v-layout(row wrap v-if="error && !loading")
          v-flex(xs12 sm6 offset-sm3)
            app-alert(@dismissed="onDismissed" :icon="error.icon" :color="error.color" :submessage="error.submessage" :text="error.message")
        v-layout(row wrap)
          v-flex(xs12 sm6 offset-sm3)
            v-card(color="purple darken-4" dark)
              v-card-text
                v-container
                  form(@submit.prevent="onSignup" @input="signUpInput = true")
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
                    v-layout(row)
                      v-flex(xs12)
                        v-btn(color="pink" dark type="submit" :disabled='loading' :loading="loading") Submit
                          span(slot="loader" class="custom-loader")
                            v-icon(light) cached
</template>

<script>
export default {
  data() {
    return {
      cycleCarousel: true,
      email: '',
      password: '',
      confirmPassword: '',
      signUpInput: null
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
    },
    userIsAuthenticated() {
      return this.$store.getters.user !== null &&
      this.$store.getters.user !== undefined
    },
    comparePasswords() {
      if (this.password !== this.confirmPassword) {
        return 'Passwords do not match'
      } else {
        return false
      }
    },
    isSignUpAlert() {
      return this.error.message.includes('Sign up')
    }
  },
  watch: {
    user(value) {
      if (value !== null && value !== undefined) {
        this.$router.push('/')
      }
    }
  },
  methods: {
    onLoadProduct(id) {
      this.$router.push(`/products/${id}`)
    },
    toggleCarousel() {
      this.cycleCarousel = !this.cycleCarousel
    },
    onDismissed() {
      this.$store.dispatch('clearError')
    },
    onSignup() {
      this.$store.dispatch('signUserUp', {email: this.email, password: this.password})
    },
    async reload() {
      await this.$store.dispatch('removeProducts', [])
      await this.$store.dispatch('loadProducts', 3);
      await this.$router.push('/products')
     }
  },
  beforeMount() {
    setTimeout(() => this.$store.dispatch('clearError'), 10000)
  }
}
</script>

<style>
.Alert {
  margin-top: 4em;
  margin-bottom: -2em;
}

.Carousel__Title {
  position: absolute;
  background-color: rgba(0,0,0,0.5);
  color: white;
  border-radius: 5px 5px 0 0;
  bottom: 50px;
  padding: 0.5em;
  margin: 0 auto;
  left: 0;
  right: 0;
}

.Carousel__Title:hover {
  color: orchid;
}
</style>