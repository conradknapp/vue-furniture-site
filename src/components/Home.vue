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
            v-carousel-item(@mouseover="stopCarousel" @mouseout="startCarousel" v-for="product in products" :src="product.imageUrl" :key="product.id" @click="onLoadProduct(product.id)")
              h1.title {{product.title}}
      v-layout(row wrap)
        v-flex(xs12).text-xs-center
          v-icon(x-large v-if="!userIsAuthenticated")#arrow keyboard_arrow_down
          v-icon(x-large v-if="!userIsAuthenticated").pb-3#arrow keyboard_arrow_down
      v-layout(v-if="!userIsAuthenticated")#hero-arrow-one
        header#header
          h1.heading-primary
            span.heading-primary-main MCM & More
            span.heading-primary-sub Love your home
      v-layout(v-if="!userIsAuthenticated")#hero-arrow-two
        header#header
          h1.heading-primary
            span.heading-primary-main MCM & More
            span.heading-primary-sub Love your home
      v-layout(row wrap v-if="!userIsAuthenticated")
        v-flex(xs12)
          .bg
          .bg.bg2
          .bg.bg3
          .bg.bg4
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
  created() {
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
    async reload() {
        // this.$store.dispatch('setFlag', true)
        this.$store.dispatch('removeProducts', [])
        await this.$store.dispatch('loadProducts', 3);
        await this.$router.push('/products')
     },
    checkSlide(e) {
      const slidingForm = document.querySelector(".slide-in");
      const slideInAt = (scrollY + innerHeight) - (slidingForm.offsetHeight / 2);
      const formBottom = slidingForm.offsetTop + slidingForm.offsetHeight + 1250;
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
    setTimeout(() => {
      this.$store.dispatch('clearError')
    }, 10000)
  }
}
// Save your favorites (heart animation)

// Find furniture you love

// Beautify your home (home animation)
</script>

<style>
  #hero-arrow-one {
   background-image: linear-gradient(
     to right bottom, rgba(145, 133, 250, 0.3),
     rgba(136, 7, 125, 0.7)),
   url(https://images.duckduckgo.com/iu/?u=http%3A%2F%2F2.bp.blogspot.com%2F-Evv3t00urQE%2FUVjmycn_Q3I%2FAAAAAAAAADA%2F-lZM0xo9hxA%2Fs1600%2FMid%2BCentury%2BFurniture%2B008.JPG&f=1);
   background-position: top;
   background-size: cover;
   height: 80vh;
   position: relative;
   /* position: absolute; */
   /* clip-path: polygon(100% 0, 100% 79%, 100% 95%, 0% 100%, 0 48%, 0 0); */
   clip-path: polygon(80% 0%, 100% 50%, 80% 100%, 0% 100%, 15% 50%, 0% 0%);
  }

  #hero-arrow-two {
    background-image: linear-gradient(
     to right bottom, rgba(145, 133, 250, 0.3),
     rgba(136, 7, 125, 0.7)),
   url(https://images.duckduckgo.com/iu/?u=http%3A%2F%2F2.bp.blogspot.com%2F-Evv3t00urQE%2FUVjmycn_Q3I%2FAAAAAAAAADA%2F-lZM0xo9hxA%2Fs1600%2FMid%2BCentury%2BFurniture%2B008.JPG&f=1);
   background-position: top;
   background-size: cover;
   height: 80vh;
   position: relative;
   /* position: absolute; */
   /* clip-path: polygon(100% 0, 100% 79%, 100% 95%, 0% 100%, 0 48%, 0 0); */
   clip-path: polygon(100% 0%, 75% 50%, 100% 100%, 25% 100%, 0% 50%, 25% 0%);
  }

  #app-alert {
    margin-top: 5rem;
    margin-bottom: 0;
  }

  #home-gradient-button {
    margin-top: 5rem;
    background: linear-gradient(to right, #5B15D4 0%,rgba(100,2,68,1) 100%);
    color:white;
    transition: all .1s ease; 
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
    transform: translateY(-1px);
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

  #header {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .heading-primary {
    color: #fff;
    text-transform: uppercase;
    backface-visibility: hidden;
  }
  
  .heading-primary-main {
    display: block;
    font-size: 60px;
    font-weight: 400;
    letter-spacing: 15px;
    animation: 1s moveInLeft ease-out;
  }

  .heading-primary-sub {
    display: block;
    font-size: 20px;
    letter-spacing: 26px;
    font-weight: 700;
    animation: 1.2s moveInRight ease-out;
  }

  @keyframes moveInLeft {
    0% {
      opacity: 0;
      transform: translateX(-100px);
    }

    100% {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes moveInRight {
    0% {
      opacity: 0;
      transform: translateX(100px);
    }

    100% {
      opacity: 1;
      transform: translateX(0);
    }
  }

  .bg {
    clip-path: polygon(0 0, 75% 0%, 100% 100%, 0 100%);
    /* clip-path: polygon(100% 0, 100% 79%, 100% 100%, 0% 100%, 0 48%, 0 5%); */
    animation:slide 3s ease-in-out infinite alternate;
    background-image: linear-gradient(-60deg, #dcf 50%, #99f 50%);
    left: -50%;
    opacity: 0.5;
    position: absolute;
    right: -50%;
    top: 100%;
    z-index: -1;
    height: 600px;
  }

  .bg2 {
    animation-direction: alternate-reverse;
    animation-duration: 4.8s;
  }

  .bg3 {
    animation-duration: 6.2s;
  }

  .bg4 {
    animation-duration: 9s;
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
    margin-top: 5rem;
    left: 0;
    right: 0;
    bottom: 0;
    position: absolute;
    z-index: 1;
  }

  #arrow {
    position: absolute;
    top: 100%;
    bottom: 0;
    height: 6rem;
    left: -50%;
    right: -50%;
    z-index: 5;
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
    transition: 2s all 0.5s;
  }

  .slide-in.active {
    opacity: 1;
    transform: translateX(0%) scale(1);
  }
</style>