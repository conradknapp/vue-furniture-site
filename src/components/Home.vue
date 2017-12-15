<template lang="pug">
    v-container
      v-layout(row wrap v-if="error && !loading")
        v-flex(xs12)
          app-alert(@dismissed="onDismissed" :icon="error.icon" :color="error.color" :submessage="error.submessage" :text="error.message")#app-alert
      v-layout(row wrap v-if="!loading")
        v-flex(xs12 class="text-xs-center")
          v-btn(large transition router dark to="/products")#home-gradient-button See All Products
      v-layout
        v-flex(xs12).text-xs-center
          v-progress-circular(indeterminate color="purple" :width="7" :size="70" v-if="loading")
      v-layout(row wrap v-if="!loading")
        v-flex(xs12).text-xs-center
          v-carousel.mb-5(v-bind="{ 'cycle': cycleStop }" interval="3000" lazy style="cursor: pointer;" delimiter-icon="home" hide-controls)
            v-carousel-item(@mouseover="stopCarousel" @mouseout="startCarousel" v-for="product in products" :src="product.imageUrl" :key="product.id" @click="onLoadProduct(product.id)")
              h1.title {{product.title}}
          span
            v-icon.mb-2(x-large v-if="!userIsAuthenticated")#arrow keyboard_arrow_down
            v-icon(x-large v-if="!userIsAuthenticated")#arrow keyboard_arrow_down
      v-layout(row wrap v-if="!userIsAuthenticated")
        v-flex(xs12)
          .b
          .bg.bg2
          .bg.bg3
          .content
            v-container.slide-in
              v-layout(row wrap v-if="!error")
                v-flex(xs12 sm6 offset-sm3).text-xs-center
                  h1 Let's Get Started
              v-layout(row wrap v-if="error && !loading")
                v-flex(xs12 sm6 offset-sm3)
                  app-alert(@dismissed="onDismissed" :icon="error.icon" :color="error.color" :submessage="error.submessage" :text="error.message")
              v-layout(row wrap)
                v-flex(xs12 sm6 offset-sm3)
                  v-card(color="orange lighten-2")
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
      if (this.password !== this.confirmPassword) {
        return 'Passwords do not match'
      } else {
        return ''
      }
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
    setTimeout(() => {
      this.$store.dispatch('clearError')
    }, 5000)
    window.addEventListener('scroll', this.checkSlide);
  },
  destroyed() {
      window.removeEventListener('scroll', this.checkSlide);
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
    },
    onSignup() {
      this.$store.dispatch('signUserUp', {email: this.email, password: this.password})
    },
    checkSlide(e) {
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
  }
}


// Save your favorites (heart animation)

// Find furniture you love

// Beautify your home (home animation)
</script>

<style>

  #app-alert {
    margin-top: 4rem;
  }

  #home-gradient-button {
    margin-top: 5em;
    background: linear-gradient(to right, #5B15D4 0%,rgba(100,2,68,1) 100%);
    color:white;
    transition: hover 0.1s linear; 
    /* background-image: linear-gradient(to right, #5B15D4 0%,rgba(100,2,68,1) 100%); */
  }
  
  #home-gradient-button:hover {
    border: 2px solid transparent;
    border-image: linear-gradient(to right, #5B15D4 0%,rgba(100,2,68,1) 100%);
    border-image-slice: 1;
    background: linear-gradient(to right, #5B15D4 0%,rgba(100,2,68,1) 100%);
    -webkit-background-clip: text;
    text-fill-color: transparent;
    color: transparent;
    border-radius: 2px;
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
    z-index: 1;
    height: 90vh;
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
    top: 100%;
    margin-top: 100px;
    left: 0;
    right: 0;
    bottom: 0;
    position: absolute;
    z-index: 1;
  }

  #arrow {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    animation: arrowDown .7s infinite alternate ease-in-out;
  }

  @keyframes arrowDown {
    0% {
      opacity: 1;
      transform: translateY(0);
    }
    100% {
      opacity: 0.7;
      transform: translateY(-0.2em);
    }
  }

  .slide-in {
    opacity: 0;
    transform: translateX(-20%) scale(1);
    transition: all 2s;
  }

  .slide-in.active {
    opacity: 1;
    transform: translateX(0%) scale(1);
  }
</style>