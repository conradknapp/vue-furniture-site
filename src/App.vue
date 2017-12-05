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
      v-toolbar-side-icon(@click.native.stop="sideNav = !sideNav" class="hidden-md-and-up")
      v-toolbar-title 
        router-link(to="/" tag="span" style="cursor: pointer") Furniture Site
      v-spacer(class="hidden-md-and-down")
      v-text-field(@blur="searchInput = ''" flex color="pink lighten-1" width="300px" prepend-icon="search" placeholder="Search any style" v-model="searchInput" @input="onSearch" single-line hide-details).ml-4.mr-2
      v-card(dark v-if="onSearchResults")#card
        v-list
          v-list-tile(@click="searchInput = ''" :to="'/products/' + result.id" v-for="result in onSearchResults" :key="result.title")
            v-list-tile-title {{result.title}} | {{result.description.slice(0,50)}}...
            v-list-tile-action(v-if="userFavorites.includes(result.id)") 
              v-icon favorite
      v-toolbar-items(class="hidden-sm-and-down")
        v-btn(flat :to="item.link" v-for="item in menuItems" :key="item.title") 
            v-icon(left) {{item.icon}}
            | {{item.title}}
        v-btn(flat router to='/profile' v-if="userIsAuthenticated" class="")
          v-badge(color="blue")
            span(slot="badge" v-if="badgeNumber") {{badgeNumber}}
            v-icon(left) account_box
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
        sideNav: false,
        searchInput: ''
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
            { icon: 'weekend', title: 'View Products', link: '/products' }
          ]
        }
        if (this.userIsAuthenticated && this.userIsAdmin) {
          menuItems = [
            { icon: 'stars', title: 'Create Product', link: '/product/new'  }
          ]
        }
        return menuItems
      },
      userIsAuthenticated() {
        return this.$store.getters.user !== null && this.$store.getters.user !== undefined
      },
      userIsAdmin() {
        return this.$store.getters.user.id === "XipYk5fNEUc1F0U5qppRHMjcTQx2"
      },
      badgeNumber() {
        return this.$store.getters.user.favoritedProducts.length
      },
      onSearchResults() {
        if (this.searchInput === '') {
          return
        } else {
          return this.$store.getters.searchResults.slice(0,5)
        }
      },
      userFavorites() {
        return this.$store.getters.user.favoritedProducts
      }
    },
    methods: {
      onLogout() {
        this.$store.dispatch('logout')
      },
      onSearch() {
        this.$store.dispatch('searchProduct', this.searchInput)
      }
    }
  }
</script>

<style>
  #card {
    position: absolute;
    overflow: hidden;
    transition: all 0.5s;
    width: 100%;
    z-index: 5;
    top: 100%;
  }
</style>