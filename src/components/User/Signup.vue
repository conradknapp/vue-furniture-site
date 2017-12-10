<template lang="pug">
  v-container
    v-layout(row wrap v-if="!error")
      v-flex(xs12 sm6 offset-sm3).text-xs-center
        h1 Get started here
    v-layout(row v-if="error")
      v-flex(xs12 sm6 offset-sm3)
        app-alert(@dismissed="onDismissed" :text="error.message" :submessage="error.submessage" :color="error.color" :icon="error.icon")
    v-layout(row)
      v-flex(xs12 sm6 offset-sm3)
        v-card
          v-card-text
            v-container
              form(@submit.prevent="onSignup")
                v-layout(row)
                  v-flex(xs12)
                    v-text-field(name="email" label="Email" id="email" v-model="email" type="email" required)
                v-layout(row)
                  v-flex(xs12)
                    v-text-field(name="password" label="Password" id="password" v-model="password" type="password" required)
                v-layout(row)
                  v-flex(xs12)
                    v-text-field(name="confirmPassword" label="Confirm Password" id="confirmPassword" v-model="confirmPassword" type="password" :rules="[comparePasswords]" required)
                v-layout(row).text-xs-center
                  v-flex(xs12)
                    v-btn(color="blue" dark type="submit" :disabled='loading' :loading="loading") Sign Up
                      span(slot="loader").custom-loader
                        v-icon(light) cached
</template>

<script>
export default {
  data() {
    return {
      email: '',
      password: '',
      confirmPassword: ''
    }
  },
  computed: {
    comparePasswords() {
      if (this.password !== this.confirmPassword) {
        return 'Passwords do not match'
      } else {
        return ''
      }
    },
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
    onSignup() {
      this.$store.dispatch('signUserUp', {email: this.email, password: this.password})
    },
    onDismissed() {
      this.$store.dispatch('clearError')
    }
  }
}
</script>

<style>
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