<template>
  <h1 :class="{'phg-side-action': !showLegacy, 'phg-exhaust': showLegacy }">
    Browse {{ showLegacy ? 'legacy ' : '' }}cards
  </h1>

  <card-browser :show-legacy="showLegacy"></card-browser>
</template>

<script>
import CardBrowser from './card_browser/CardBrowser.vue'

export default {
  name: 'CardListing',
  components: {
    CardBrowser,
  },
  computed: {
    showLegacy () {
      return !!this.$route.meta.showLegacy
    }
  },
}
</script>
