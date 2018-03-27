<template lang="pug">
v-container(fluid grid-list-md class="text-xs-center")
  v-layout(row wrap v-if="error && !loading")
    v-flex(xs12)
      app-alert(v-if="!isSignUpAlert" @dismissed="onDismissed" :icon="error.icon" :color="error.color" :submessage="error.submessage" :text="error.message" class="Alert")
  v-layout(row wrap v-if="!loading")
    v-flex(xs12)
      v-btn(large dark @click="onReloadProducts" class="darken-4 purple" id="Products__Button") Explore Products
  v-layout
    v-flex(xs12)
      v-progress-circular(indeterminate color="purple" :width="7" :size="70" v-if="loading")
  v-layout(row wrap v-if="!loading")
    v-flex(xs12)
      v-carousel(v-bind="{ 'cycle': cycleCarousel }" interval="3000" style="cursor: pointer; animation-play-state: paused;" delimiter-icon="home" id="Carousel" lazy)
        v-carousel-item(@mouseover="toggleCarousel" @mouseout="toggleCarousel" v-for="product in products" :src="product.imageUrl" :key="product.id" @click="onLoadProduct(product.id)")
          h1(class="Carousel__Title") {{product.title}}
      #Info__Card(v-if="!userIsAuthenticated")
        v-layout(row wrap)
          v-flex(xs12)
            h1
              span(style="font-weight: bold;") Love
              |  Your Home
            h2 Find the best curated furniture and home accessories here
      v-container(class="slide-in")(v-if="!userIsAuthenticated")
        v-layout(row wrap v-if="!error")
          v-flex(xs12 sm6 offset-sm3)
            h1 Let's Get Started
            h3 Sign up to save your favorites
        v-layout(row wrap v-if="error && !loading")
          v-flex(xs12 sm6 offset-sm3)
            app-alert(@dismissed="onDismissed" :icon="error.icon" :color="error.color" :submessage="error.submessage" :text="error.message")
        v-layout(row wrap)
          v-flex(xs12 sm6 offset-sm3)
            v-card(color="purple darken-4" class="mt-4 mb-5" dark)
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
                        v-btn(color="pink darken-2" dark type="submit" :disabled='loading' :loading="loading") Let's Go!
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
  created() {
    window.addEventListener('scroll', this.onFormSlide);
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.onFormSlide);
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
    async onReloadProducts() {
      await this.$store.dispatch('removeProducts', [])
      await this.$store.dispatch('loadProducts', 5);
      await this.$router.push('/products')
    },
    onFormSlide() {
      const slidingForm = document.querySelector(".slide-in");
      const slideInAt = (scrollY + innerHeight) - (slidingForm.offsetHeight / 2);
      const formBottom = slidingForm.offsetTop + slidingForm.offsetHeight + 1000;
      const half = slideInAt > slidingForm.offsetTop;
      const notScrolledPast = window.scrollY < formBottom ;
      if (half && notScrolledPast) {
        slidingForm.classList.add('active');
      } else {
        slidingForm.classList.remove('active');
      }
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

#Products__Button {
  margin: 5em 0 2em 0;
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

h1 {
  font-weight: 100;
  font-size: 2.5rem;
}

#Info__Card {
  color: white;
  margin: 5em 0 3em 0; 
  padding: 3em;
  background-color: purple;
  background-image: repeating-linear-gradient(45deg,transparent,transparent 35px,rgba(255,255,255,.25) 35px,rgba(255,255,255,.25) 70px);
  background-size: 100%;
  transition: 5000ms;
}

#Info__Card:hover {
  background-size: 500%;
}

.slide-in {
  opacity: 0;
  transform: translateX(-20%) scale(1);
  transition: all 2s;
}

.active {
  opacity: 1;
  transform: translateX(0%) scale(1);
}

@media screen and (max-width: 500px) {
  #Carousel {
    height: 60vh;
  }
  h1 {
    font-size: 1.7rem;
  }
}
</style>