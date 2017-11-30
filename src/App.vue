<template lang="pug">
  v-app
    v-navigation-drawer(temporary overflow absolute v-model="sideNav")
      v-list
        v-list-tile(v-for="item in menuItems" :key="item.title" :to="item.link")
          v-list-tile-action
            v-icon {{item.icon}}
          v-list-tile-content {{item.title}}
        v-list-tile(v-if="userIsAuthenticated" @click="onLogout")
          v-list-tile-action
            v-icon exit_to_app
          v-list-tile-content Logout
    v-toolbar(class="deep-purple darken-2" dark)
      v-toolbar-side-icon(@click.native.stop="sideNav = !sideNav" class="hidden-sm-and-up")
      v-toolbar-title 
        router-link(to="/" tag="span" style="cursor:pointer") Furniture
      v-spacer
      v-text-field(flex color="pink lighten-1" width="300px" prepend-icon="search" placeholder="Search any style..." single-line hide-details)
      v-toolbar-items(class="hidden-xs-only")
        v-btn(flat :to="item.link" v-for="item in menuItems" :key="item.title") 
            v-icon(left) {{item.icon}}
            | {{item.title}}
        v-btn(flat router to='/profile' v-if="userIsAuthenticated")
          v-badge(color="blue")
            span(slot="badge" v-if="badgeNumber") {{badgeNumber}}
            v-icon(left) account_circle
            | Profile
        v-btn(flat v-if="userIsAuthenticated" @click="onLogout")
          v-icon(left) exit_to_app
          | Logout
    main
      router-view 
</template>


<script>
  export default {
    data () {
      return {
        sideNav: false
      }
    },
    computed: {
      menuItems() {
        let menuItems = [
          { icon: 'weekend', title: 'View Products', link: '/products' },
          { icon: 'lock_open', title: 'Sign In', link: '/signin' },
          { icon: 'create', title: 'Sign Up', link:  '/signup' }
        ]
        if (this.userIsAuthenticated) {
          menuItems = [
          { icon: 'weekend', title: 'View Products', link: '/products' },
          { icon: 'stars', title: 'Create Product', link: '/product/new'  }
          ]
        }
        return menuItems
      },
      userIsAuthenticated() {
        return this.$store.getters.user !== null && this.$store.getters.user !== undefined
      },
      badgeNumber() {
        return this.$store.getters.user.favoritedProducts.length
      }
    },
    methods: {
      onLogout() {
        this.$store.dispatch('logout')
      }
    }
  }
</script>

<style scoped>

</style>
