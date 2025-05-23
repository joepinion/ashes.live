<template>
  <div v-if="isDeckbuilderActive && isUnrestricted">
    <button
        class="flex-none"
        :class="{
          [$style.btn]: true,
          [$style.btnActive]: false,
          [$style.btnFirst]: true,
          [$style.btnLast]: false,
          [$style.standalone]: true,
        }"
        @click="setCardCount(card, this.deckCount-1)"
        :disabled="isSaving || this.deckCount===0">
          <i class="fas fa-minus"><span class="alt-text">1 less</span></i>
      </button>
      <button
        class="flex-none"
        :class="{
          [$style.btn]: true,
          [$style.btnActive]: false,
          [$style.btnFirst]: false,
          [$style.btnLast]: true,
          [$style.standalone]: true,
        }"
        @click="setCardCount(card, this.deckCount+1)"
        :disabled="isSaving">
          <i class="fas fa-plus"><span class="alt-text">1 more</span></i>
      </button>
      <span
        class="w-7 inline-block text-center">
        {{ deckCount }}
      </span>
  </div>
  <div v-else-if="isDeckbuilderActive && isNotConjuration && isNotReference && !card.is_legacy">
    <div v-if="isPhoenixborn"
      :class="{
        shadow: isPopup,
        'inline-block': !standalone,
      }">
      <span
        v-if="deckPhoenixborn && deckPhoenixborn.stub == card.stub"
        :class="[$style.btn, $style.btnActive, $style.btnFirst, $style.btnLast, standalone ? `${$style.standalone} w-full` : '']">
        <i class="fas fa-check-square"></i> In use
      </span>
      <button v-else
        :class="[$style.btn, $style.btnFirst, $style.btnLast, standalone ? `${$style.standalone} w-full` : '']"
        @click="usePhoenixborn"
        :disabled="isSaving">
        <span v-if="!deckPhoenixborn">
          <i class="fas fa-plus"></i> Use
        </span>
        <span v-else>
          <i class="fas fa-exchange-alt"></i> Swap
        </span>
      </button>
    </div>
    <div v-else-if="!deckPhoenixborn || !card.phoenixborn || deckPhoenixborn.name === card.phoenixborn"
      class="flex flex-nowrap"
      :class="{
        shadow: isPopup,
        'inline-block': !standalone,
      }">
      <button
        v-for="count of Array(4).keys()" :key="count"
        class="flex-none"
        :class="{
          [$style.btn]: true,
          [$style.btnActive]: deckCount === count,
          [$style.btnFirst]: count === 0,
          [$style.btnLast]: count === 3,
          [$style.standalone]: standalone,
        }"
        @click="setCardCount(card, count)"
        :disabled="isSaving || (card.phoenixborn && count + phoenixbornUniqueCount - deckCount > 3)">
          <i v-if="count === 0 && zeroRemovesCard" class="fas fa-times"><span class="alt-text">Remove</span></i>
          <span v-else>{{ count }}</span>
        </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DeckQuantityButtons',
  props: {
    card: {
      required: true,
    },
    freeforall:{
      type: Boolean,
      default: false,
    },
    standalone: {
      type: Boolean,
      default: false,
    },
    isPopup: {
      type: Boolean,
      default: false,
    },
    zeroRemovesCard: {
      type: Boolean,
      default: false,
    }
  },
  computed: {
    isPhoenixborn () {
      return this.card.type === 'Phoenixborn'
    },
    isDeckbuilderActive () {
      return this.$store.state.builder.enabled
    },
    isUnrestricted() {
      return this.$store.state.builder.deck.is_unrestricted
    },
    isNotConjuration () {
      return this.card.type !== 'Conjuration' && this.card.type !== 'Conjured Alteration Spell'
    },
    isNotReference() {
      return this.card.type !== 'Reference'
    },
    deckPhoenixborn () {
      return this.$store.state.builder.deck.phoenixborn
    },
    phoenixbornUniqueCount () {
      return this.$store.getters['builder/phoenixbornUniqueCount']
    },
    deckCount () {
      return this.$store.state.builder.countMap[this.card.stub] || 0
    },
    isSaving () {
      return this.$store.state.builder.isSaving
    },
  },
  methods: {
    usePhoenixborn () {
      this.$store.dispatch('builder/setPhoenixborn', this.card)
    },
    setCardCount (card, count) {
      if (this.deckCount === count) return
      this.$store.dispatch('builder/setCardCount', {
        card,
        count,
      })
    },
  },
}
</script>

<style lang="postcss" module>
.btn {
  @apply appearance-none inline-block border-black bg-gray-light leading-none px-2 py-1 text-black font-bold text-center border-t-2 border-l-2;
  min-width: 32px;

  &.standalone {
    @apply border-b-2;
  }
}

.btnFirst {
  @apply rounded-tl-md;

  &.standalone {
    @apply rounded-bl-md;
  }
}

.btnLast {
  @apply rounded-tr-md border-r-2;

  &.standalone {
    @apply rounded-br-md;
  }
}

.btnActive {
  @apply bg-black text-white;
}
</style>
