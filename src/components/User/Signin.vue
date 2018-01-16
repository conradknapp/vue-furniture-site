<template lang="pug">
  v-container(flexbox center)
    v-layout(row wrap v-if="!error")
      v-flex(xs12 sm6 offset-sm3).text-xs-center
        h1 Welcome Back!
    v-layout(row v-if="error")
      v-flex(xs12 sm6 offset-sm3)
        app-alert(@dismissed="onDismissed" :text="error.message" :color="error.color" :icon="error.icon")
    v-layout(row wrap)
      v-flex(xs12 sm6 offset-sm3)
        v-card
          v-card-text
            v-container
              form(@submit.prevent="onSignin")
                v-layout(row)
                  v-flex(xs12)
                    v-text-field(name="email" prepend-icon="email" label="Email" id="email" v-model="email" type="email" required)
                v-layout(row)
                  v-flex(xs12)
                    v-text-field(name="password" label="Password" id="password" v-model="password" prepend-icon="extension" type="password" required)
                v-layout(row).text-xs-center
                  v-flex(xs12)
                    v-btn(type="submit" :disabled='loading' :loading="loading" color="orange") Sign in
                      span(slot="loader").custom-loader
                        v-icon(light) cached
                    h3 Don't have an account? 
                      router-link(to="/signup") Sign up
</template>

<script>
export default {
  data() {
    return {
      email: '',
      password: ''
    }
  },
  computed: {
    user() {
      return this.$store.getters.user
    },
    error() {
      return this.$store.getters.error
    },
    loading() {
      return this.$store.getters.loading
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
    onSignin() {
      this.$store.dispatch('signUserIn', {email: this.email, password: this.password})
    },
    onDismissed() {
      this.$store.dispatch('clearError')
    }
  }
}
</script>

<style scoped>
  .custom-loader {
    animation: loader 1s infinite;
    display: flex;
  }
  @-moz-keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
  @-webkit-keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
  @-o-keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
  @keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
</style>