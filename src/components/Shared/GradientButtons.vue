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
