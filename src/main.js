import Vue from 'vue'

import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.css'

import App from './App'
import router from './router'
import {store} from './store'
import * as firebase from 'firebase'
import AlertCmp from './components/Shared/Alert.vue'
import EditProductDetailsDialog from './components/Product/Edit/EditProductDetailsDialog'
import HeartFlutter from './components/Shared/Heart.vue'

Vue.use(Vuetify)

Vue.component('app-alert', AlertCmp)
Vue.component('app-edit-product-details-dialog', EditProductDetailsDialog)
Vue.component('heart-flutter', HeartFlutter)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App),
  created() {
    firebase.initializeApp({
      apiKey: "AIzaSyCEnIlJH29JvA-2wS9cd1_9NUjvQBlzf9Y",
      authDomain: "furniture-site-d9a32.firebaseapp.com",
      databaseURL: "https://furniture-site-d9a32.firebaseio.com",
      projectId: "furniture-site-d9a32",
      storageBucket: "furniture-site-d9a32.appspot.com"
    })
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.$store.dispatch('autoSignIn', user)
        this.$store.dispatch('fetchUserData')
        this.$store.dispatch('loadAllProducts')
      }
    })
  }
})