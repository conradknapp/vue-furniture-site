import Vue from 'vue'
import Vuex, { mapActions } from 'vuex'
import * as firebase from 'firebase'

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    loadedProducts: [],
    allProducts: [],
    user: null,
    loading: null,
    heartLoading: null,
    error: null,
    searchResults: [],
    productLiked: null,
    oldestKey: ``,
    justSignedIn: null,
    resultsLog: null,
    flag: null,
    productIndex: null,
    lastKeys: []
  },
  mutations: {
    favoriteProduct(state, payload) {
      const id = payload.id
      const time = payload.timeFavorited
      if (state.user.favoritedProducts.findIndex(product => product.id === id) >= 0) {
        return
      }
      state.user.favoritedProducts.push(id)
      console.log(state.user.favoritedProducts)
      state.user.fbKeys[id] = payload.fbKey
    },
    unfavoriteProduct(state, payload) {
      const faveProducts = state.user.favoritedProducts
      faveProducts.splice(faveProducts.indexOf(payload), 1)
      Reflect.deleteProperty(state.user.fbKeys, payload)
    },
    createProduct(state, payload) {
      state.loadedProducts.push(payload)
    },
    updateProduct(state, payload) {
      const product = state.loadedProducts.find(product => {
        return product.id === payload.id
      })
      if (payload.title) {
        product.title = payload.title
      }
      if (payload.description) {
        product.description = payload.description
      }
    },
    setUser(state, payload) {
      state.user = payload
    },
    setLoading(state, payload) {
      state.loading = payload
    },
    setError(state, payload) {
      state.error = payload
    },
    clearError(state) {
      state.error = null
    },
    setLoadedProducts(state, payload) {
      state.loadedProducts.push(...payload)
    },
    removeProducts(state, payload) {
      state.loadedProducts = payload
    },
    setSearchResults(state, payload) {
      state.searchResults = payload
    },
    setOldestKey(state, payload) {
      state.oldestKey = payload
    },
    setHeartLoading(state, payload) {
      state.heartLoading = payload
    },
    setResultsLog(state, payload) {
      state.resultsLog = payload
    },
    setAllProducts(state, payload) {
      state.allProducts = payload
    },
    setFlag(state, payload) {
      state.flag = payload
    },
    setProductIndex(state, payload) {
      state.productIndex = payload
    },
    setLastKeys(state, payload) {
      state.lastKeys = payload
    }
  },
  actions: {
    loadAllProducts({commit}) {
      commit('setLoading', true)
      firebase.database().ref('products')
        .orderByKey()
        .once('value')
        .then(data => {
          const products = []
          const obj = data.val()
          for (let key in obj) {
            products.push({
              id: key,
              title: obj[key].title,
              categories: obj[key].categories,
              imageUrl: obj[key].imageUrl,
              description: obj[key].description,
              links: obj[key].links,
              date: obj[key].date,
              creatorId: obj[key].creatorId
            })
          }
          commit('setAllProducts', products.reverse())
          commit('setLoading', false)
        })
        .catch(error => {
          commit('setLoading', false)
          console.log(error)
        })
    },
    loadProduct({commit, getters}, payload) {
      commit('setLoading', true)
      firebase.database().ref('/products/' + payload)
        .once('value')
        .then(data => {
          const obj = data.val()
          const key = data.key
          let product = {id: key, ...obj}
          let productLoaded = getters.loadedProducts.findIndex((product) => {
            return product.id === payload
          }) !== -1
          console.log(productLoaded)
          if (!productLoaded) {
            getters.loadedProducts.push(product)
          }
          console.log(getters.loadedProducts)
          commit('setLoading', false)
        })
        .catch(error => {
          commit('setLoading', false)
          console.log(error)
        })
    },
    loadProducts({commit}, payload = 3) {
      commit('setLoading', true)
      let oldestKey = ``
      firebase.database().ref('products')
        .orderByKey()
        .limitToLast(payload)
        .once('value')
        .then(data => {
          const products = []
          const obj = data.val()
          for (let key in obj) {
            products.push({
              id: key,
              title: obj[key].title,
              categories: obj[key].categories,
              imageUrl: obj[key].imageUrl,
              description: obj[key].description,
              links: obj[key].links,
              date: obj[key].date,
              creatorId: obj[key].creatorId
            })
          }
          let arrayOfKeys = Object.keys(obj)
          oldestKey = arrayOfKeys[0]
          commit('setLoadedProducts', products.reverse())
          commit('setOldestKey', oldestKey)
          commit('setLoading', false)
        })
        .catch(error => {
          commit('setLoading', false)
          console.log(error)
        })
    },
      infiniteScroll({commit, getters}) {
        commit('setLoading', true)
        firebase.database().ref('products')
          .orderByKey()
          .endAt(getters.oldestKey)
          .limitToLast(4)
          .once('value')
          .then(data => {
            const products = []
            const obj = data.val()
            for (let key in obj) {
              products.push({
                id: key,
                title: obj[key].title,
                categories: obj[key].categories,
                imageUrl: obj[key].imageUrl,
                description: obj[key].description,
                links: obj[key].links,
                date: obj[key].date,
                creatorId: obj[key].creatorId
              })
            }
            let slice = products.reverse().slice(1)
            let arrayOfKeys = Object.keys(obj)

            // if (arrayOfKeys.length === 1) {
            //   commit('setLoading', false)
            //   commit('setResultsLog', 'You have reached the end')
            //   return
            // }
            console.log(arrayOfKeys[0]);
            getters.lastKeys.push(arrayOfKeys[0]);
            getters.lastKeys.splice(-3, getters.lastKeys.length - 2); 
            if (getters.lastKeys[getters.lastKeys.length - 1] === getters.lastKeys[getters.lastKeys.length - 2]) {
              commit('setLoading', false)
              commit('setResultsLog', true)
              commit('setLastKeys', [])
              return
            }
            console.log(getters.lastKeys);
            commit('setOldestKey', arrayOfKeys[0])
            commit('setLoadedProducts', slice)
            commit('setLoading', false) 
          })
    },
    searchProduct({commit}, payload) {
      firebase.database().ref('products').orderByValue().on('value', snapshot => {
        let keysArray = snapshot.val()
        let arr = []
        for (let key in keysArray) {
          arr.push({
            id: key,
            title: keysArray[key].title,
            description: keysArray[key].description,
            imageUrl: keysArray[key].imageUrl
          })
        }
          let results = arr.filter(el => {
            let regex = new RegExp(payload, 'gi')
            if (el.title.match(regex) || el.description.match(regex)) {
              return el
            }
          })
          // console.log(results)
          commit('setSearchResults', results)
      })
    },
    favoriteProduct({commit, getters}, payload) {
      commit('setHeartLoading', true)
      const user = getters.user
      firebase.database().ref('/users/' + user.id) 
        .child('/favorites/')
        .push(payload)
        .then(data => {
          commit('favoriteProduct', {id: payload, timeFavorited: new Date(), fbKey: data.key})
          setTimeout(() => commit('setHeartLoading', false), 1200)
          commit('setLoading', false)
        })
        .catch(error => {
          commit('setLoading', false)
          console.log(error)
        })
    },
    unfavoriteProduct({commit, getters}, payload) {
      const user = getters.user
      const fbKey = user.fbKeys[payload]
      firebase.database().ref('/users/' + user.id + '/favorites/').child(fbKey)
        .remove()
        .then(data => {
          commit('unfavoriteProduct', payload)
        })
        .catch(error => {
          console.log(error)
        })
    },
    createProduct({commit, getters}, payload) {
      const product = {
        title: payload.title,
        categories: payload.categories,
        imageUrl: payload.imageUrl,
        description: payload.description,
        links: payload.links,
        date: payload.date.toISOString(),
        creatorId: getters.user.id
      }
      firebase.database().ref('products').push(product)
        .then(data => {
          const key = data.key
          commit('createProduct', {...product, id: key})
        })
        .catch(error => {
          console.log(error)
        })
    },
    updateProductData({commit}, payload) {
      commit('setLoading', true)
      const updateObj = {}
      if (payload.title) {
        updateObj.title = payload.title
      }
      if (payload.description) {
        updateObj.description = payload.description
      }
      firebase.database().ref('products').child(payload.id).update(updateObj)
        .then(() => {
          commit('setLoading', false)
          commit('updateProduct', payload)
        })
        .catch(error => {
          commit('setLoading', false)
          console.log(error)
        })
    },
    signUserUp({commit}, payload) {
      commit('setLoading', true)
      commit('clearError')
      firebase.auth().createUserWithEmailAndPassword(payload.email, payload.password)
        .then(
          user => {
            commit('setLoading', false)
            const newUser = {
              id: user.uid,
              favoritedProducts: [],
              fbKeys: {}
            }
            commit('setUser', newUser)
            commit('setError', {message: `You are now signed up!!`, icon: 'check_circle', color: 'green'})
          }
        )
        .catch(error => {
          commit('setLoading', false)
          commit('setError', error)
          console.log(error)
        })
    },
    signUserIn({commit}, payload) {
      commit('setLoading', true)
      commit('clearError')
      firebase.auth().signInWithEmailAndPassword(payload.email, payload.password)
        .then(
          user => {
            commit('setLoading', false)
            const newUser = {
              id: user.uid,
              favoritedProducts: [],
              fbKeys: {}
            }
            commit('setUser', newUser)
            commit('setError', {message: `🎉  You are now signed in  🎉`, icon: 'check_circle', color: 'green'})
          }
        )
        .catch(error => {
          commit('setLoading', false)
          commit('setError', error)
          console.log(error)
        })
    },
    autoSignIn({commit}, payload) {
      commit('setUser', {
        id: payload.uid, 
        favoritedProducts: [],
        fbKeys: {}
      })
    },
    fetchUserData({commit, getters}) {
      commit('setLoading', true)
      firebase.database().ref('/users/' + getters.user.id + '/favorites/')
        .once('value')
        .then(data => {
          const dataPairs = data.val()
          let favoritedProducts = []
          let swappedPairs = {}
          for (let key in dataPairs) {
            favoritedProducts.push(dataPairs[key])
            swappedPairs[dataPairs[key]] = key
          }
          const updatedUser = {
            id: getters.user.id,
            favoritedProducts: favoritedProducts,
            fbKeys: swappedPairs
          }
          commit('setLoading', false)
          commit('setUser', updatedUser)
        })
        .catch(error => {
          commit('setLoading', false)
          console.log(error)
        })
    },
    logout({commit}) {
      firebase.auth().signOut()
      commit('setUser', null)
    },
    clearError({commit}) {
      commit('clearError')
    },
    unAuthUserClick({commit}, payload) {
      commit('setError', payload)
    },
    setFlag({commit}, payload) {
      commit('setFlag', payload)
    },
    removeProducts({commit, getters}, payload) {
      commit('removeProducts', [])
    },
    setProductIndex({commit}, payload) {
      commit('setProductIndex', payload)
    },
    setResultsLog({commit}, payload) {
      commit('setResultsLog', payload)
    }
  },
  getters: {
    loadedProducts(state) {
      let loadedProducts = state.loadedProducts
      loadedProducts.sort((productA, productB) => {
        return productA.date < productB.date
      })
      return loadedProducts
    },
    loadedProduct(state) {
      return (productId) => {
        return state.loadedProducts.find((product) => {
          return product.id === productId
        })
      }
    },
    featuredProducts(state, getters) {
      return getters.loadedProducts.slice(0,5)
    },
    getProductsWithFlexProperty(state, getters) {
      let loadedProducts = getters.loadedProducts
      loadedProducts.forEach((el, i) => {
        if (i % 3) {
          el['flex'] = 6
        } else {
          el['flex'] = 12
        }
      });
      return loadedProducts
    },
    user(state) {
      return state.user
    },
    loading(state) {
      return state.loading
    },
    error(state) {
      return state.error
    },
    searchResults(state) {
      return state.searchResults
    },
    oldestKey(state) {
      return state.oldestKey
    },
    heartLoading(state) {
      return state.heartLoading
    },
    resultsLog(state) {
      return state.resultsLog
    },
    allProducts(state) {
      return state.allProducts
    },
    flag(state) {
      return state.flag
    },
    productIndex(state) {
      return state.productIndex
    },
    lastKeys(state) {
      return state.lastKeys
    }
  }
})