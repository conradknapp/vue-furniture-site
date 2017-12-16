<template lang="pug">
  v-container
    v-layout(row wrap v-if='!loading').hidden-xs-only
      v-flex(xs12 d-flex)
        v-btn(dark large).gradient-btn.btn-1
          v-icon(left) event_seat
          h3.hidden-sm-and-down Chairs
        v-btn(dark large).gradient-btn.btn-2
          v-icon(left) weekend
          h3.hidden-sm-and-down Sofas
        v-btn(dark large).gradient-btn.btn-3
          img(src="../../assets/table.svg")
          h3.hidden-sm-and-down Tables
        v-btn(dark large).gradient-btn.btn-4
          img(src="../../assets/lamp.svg")
          h3.hidden-sm-and-down Lamps
        v-btn(dark large).gradient-btn.btn-5
          img(src="../../assets/bed.svg")
          h3.hidden-sm-and-down Beds
        v-btn(dark large).gradient-btn.btn-6
          img(src="../../assets/dresser.svg")
          h3.hidden-sm-and-down Dressers
</template>

<style>
  .btn-1 {
    background-image: linear-gradient(270deg, #0D8691 0%, #209DAB 100%);
  }

  .btn-2 {
    background-image: linear-gradient(270deg, #0D86AB 0%, #0D8691 100%);
  }

  .btn-3 {
    background-image: linear-gradient(270deg, #056582 0%, #0D86AB 100%)
  }

  .btn-4 {
    background-image: linear-gradient(270deg, #05799C 0%, #056582 100%);
  }

  .btn-5 {
    background-image: linear-gradient(270deg, #03536B 0%, #05799C 100%);
  }

  .btn-6 {
    background-image: linear-gradient(270deg, #02384D 0%, #03536B 100%);
  }
</style>