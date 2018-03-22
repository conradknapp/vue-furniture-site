<template lang="pug">
  v-layout(row wrap)
      v-flex(xs12 sm6)
        v-card.mt-3.ml-1.mr-2(hover)
          v-card-media(height="40vh" class="grey" id="skeleton")
            v-container(fill-height fluid)
              v-layout(fill-height)
                v-flex(xs12 align-end flexbox)
                  span(class="Product__Skeleton--Headline").headline Product Skeleton
                  span(class="Product__Skeleton--Description") 
                  div
                    v-btn(x-large icon)
                      v-icon(color="gray darken-3" x-large) favorite
      v-flex(xs12 sm6)
        v-card.mt-3.ml-1.mr-2(hover)
          v-card-media(height="40vh" class="grey" id="skeleton")
            v-container(fill-height fluid)
              v-layout(fill-height)
                v-flex(xs12 align-end flexbox)
                  span(class="Product__Skeleton--Headline").headline Product Skeleton
                  span(class="Product__Skeleton--Description") 
                  div
                    v-btn(x-large icon)
                      v-icon(color="gray darken-3" x-large) favorite     
</template>

<style scoped>
.Product__Skeleton--Headline {
  color: rgb(58, 57, 57);
  background: rgb(58, 57, 57);
}

.Product__Skeleton--Description {
  color: rgb(58, 57, 57);
  background: rgb(58, 57, 57);
  min-height: 4em;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
}

#skeleton {
  position: relative;
  overflow: hidden;
}

#skeleton::after {
  content: '';
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  width: 50%;
  height: 100%;
  animation: sweep 2s infinite;
  background-image: linear-gradient(to left, transparent, rgba(255, 255, 255, 0.4), transparent);
}

@keyframes sweep {
  0% {
    transform: translateX(-100%);
  }
  50% {
    transform: translateX(150%);
  }
  100% {
    transform: translate(-100%);
  }
}
</style>
