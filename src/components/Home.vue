<template lang="pug">
v-container(fluid grid-list-md)
  v-layout(row wrap v-if="error && !loading")
    v-flex(xs12)
      app-alert(v-if="!errorContains" @dismissed="onDismissed" :icon="error.icon" :color="error.color" :submessage="error.submessage" :text="error.message")#app-alert
  v-layout(row wrap v-if="!loading")
    v-flex(xs12 class="text-xs-center")
      v-btn(large transition @click="reload")#home-gradient-button See All Products
  v-layout
    v-flex(xs12).text-xs-center
      v-progress-circular(indeterminate color="purple" :width="7" :size="70" v-if="loading")
  v-layout(row wrap v-if="!loading")
    v-flex(xs12).text-xs-center
      v-carousel(v-bind="{ 'cycle': cycleStop }" interval="3000" lazy style="cursor: pointer;" delimiter-icon="home" hide-controls)
        v-carousel-item(@mouseover="toggleCarousel" @mouseout="toggleCarousel" v-for="product in products" :src="product.imageUrl" :key="product.id" @click="onLoadProduct(product.id)" id="carousel-item")
          h1.title {{product.title}}
      v-container
        v-layout(row wrap v-if="!error")
          v-flex(xs12 sm6 offset-sm3).text-white.text-xs-center
            h1 Let's Get Started
            h3 Sign up to save your favorites
        v-layout(row wrap v-if="error && !loading")
          v-flex(xs12 sm6 offset-sm3)
            app-alert(@dismissed="onDismissed" :icon="error.icon" :color="error.color" :submessage="error.submessage" :text="error.message")
        v-layout(row wrap)
          v-flex(xs12 sm6 offset-sm3)
            v-card(color="purple darken-2")#card-style
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
                    v-layout(row).text-xs-center
                      v-flex(xs12)
                        v-btn(color="blue" dark type="submit" :disabled='loading' :loading="loading") Submit
                          span(slot="loader").custom-loader
                            v-icon(light) cached
</template>

<script>
export default {
  data() {
    return {
      cycleStop: true,
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
      this.password !== this.confirmPassword ? 'Passwords do not match' : ''
    },
    errorContains() {
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
      this.$router.push('/products/' + id)
    },
    toggleCarousel() {
      this.cycleStop = !this.cycleStop
    },
    onDismissed() {
      this.$store.dispatch('clearError')
    },
    onSignup() {
      this.$store.dispatch('signUserUp', {email: this.email, password: this.password})
    },
    async reload() {
        this.$store.dispatch('removeProducts', [])
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
  #app-alert {
    margin-top: 5rem;
    margin-bottom: 0;
  }

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
    animation-play-state: paused;
  }

  .slide-in {
    position: absolute;
    left: -50%;
    right: -50%;
    opacity: 0;
    padding: 0;
    transform: translateX(-20%) scale(1);
    transition: 2s all 0.5s;
  }
</style>