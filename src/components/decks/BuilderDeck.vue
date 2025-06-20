<template>
  <div>
    <h2 class="text-lg mb-2 font-bold" v-if="!isUnrestricted">
      <i :class="typeClass('Phoenixborn')"></i>
      {{ phoenixborn.name }}
    </h2>
    <div class="mb-4 text-sm">
      <div v-if="phoenixbornCard && !isUnrestricted" class="text-center -mb-2.5">
        <span
          class="inline-block border border-red-light px-1 bg-white">Battlefield <strong>{{ phoenixbornCard.battlefield }}</strong></span>
        <span
          class="inline-block border border-green-light px-1 mx-1 bg-white">Life <strong>{{ phoenixbornCard.life }}</strong></span>
        <span
          class="inline-block border border-blue-dark px-1 bg-white">Spellboard <strong>{{ phoenixbornCard.spellboard }}</strong></span>
      </div>
      <!-- Setting a key ensures that this updates when the Phoenixborn card updates (not reactive otherwise, thanks to our setup-based compilation) -->
      <card-codes
        v-if="phoenixbornCard && !isUnrestricted"
        class="border-gray border rounded px-2 py-1 pt-4 m-0"
        :content="phoenixbornCard.text"
        :key="phoenixbornCard.stub"
        is-card-effect></card-codes>
    </div>
    <ul class="grid gap-2 mb-4" :class="$style.autoFitDiceGrid">
      <li v-for="(die, index) of diceList" :key="index"
          class="die w-8 h-8 text-xl text-center"
          :class="[die ? `${die} cursor-pointer` : 'basic', 'phg-' + (die ? die + '-power' : 'basic-magic')]"
          @click="reduceDieCount(die)">
          <span class="alt-text">{{ die ? `Remove ${die.name} die` : '(empty)' }}</span>
      </li>
    </ul>
    <div class="grid gap-2" :class="$style.autoFitControlsGrid">
      <die-counter v-for="dieName of allDiceTypes" :key="dieName" :name="dieName"></die-counter>
    </div>
    <!-- TODO: do I want to implement the "Clear dice" and "Set filters" buttons? Not sure anyone actually used them... -->
    <hr class="mt-6 mb-4">

    <div class="flex mb-4">
      <h3 class="flex-grow m-0">Cards <span class="text-gray">(<span :class="{'text-red': totalCards > 30}">{{ totalCards }} / {{ is_unrestricted ? '100' : '30' }}</span>)</span></h3>
      <button class="text-lg text-black px-1" title="Add cards..." @click="addCards">
        <i class="fas fa-plus"></i>
        <span class="alt-text">Add cards...</span>
      </button>
    </div>

    <div v-for="section of deckSections" :key="section.title">
      <h4><i :class="typeClass(section.contents[0].type)"></i> {{ section.title }} <span class="text-gray">({{ section.count }})</span></h4>
      <ul class="mb-4">
        <li v-for="card of section.contents" :key="card.stub" class="mb-1">
          <div class="flex">
            <deck-qty-buttons class="flex-none mr-1" :card="card" standalone zero-removes-card></deck-qty-buttons>
            <div class="flex-grow pt-0.5">
              <card-link :card="card"></card-link>
              <span v-if="card.phoenixborn" class="text-gray" :title="card.phoenixborn">
                ({{ card.phoenixborn.split(/,?[ ]/)[0] }})
              </span>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <div v-if="conjurations && conjurations.length && !isUnrestricted">
      <hr class="mt-6 mb-4">
      <h4><i :class="typeClass('Conjuration')"></i> Conjurations <span class="text-gray">({{ totalConjurations }})</span></h4>
      <ul>
        <li v-for="card of conjurations" :key="card.stub" class="mb-1">
          {{ card.count }}&times; <card-link :card="card"></card-link>
          <span v-if="card.phoenixborn" class="text-gray" :title="card.phoenixborn">
            ({{ card.phoenixborn.split(/,?[ ]/)[0] }})
          </span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { diceList, typeToFontAwesome } from '/src/constants.js'
import { capitalize } from '/src/utils/text.js'
import useHandleResponseError from '/src/composition/useHandleResponseError.js'
import CardCodes from '../shared/CardCodes.vue'
import DieCounter from './DieCounter.vue'
import DeckQtyButtons from '../shared/DeckQtyButtons.vue'

export default {
  name: 'BuilderDeck',
  setup () {
    // Standard composite containing { toast, handleResponseError }
    return useHandleResponseError()
  },
  components: {
    CardCodes,
    DieCounter,
    DeckQtyButtons,
  },
  emits: ['closePane'],
  computed: {
    allDiceTypes () {
      return diceList
    },
    phoenixborn () {
      return this.$store.state.builder.deck.phoenixborn
    },
    phoenixbornCard () {
      if (!this.phoenixborn || !this.phoenixborn.stub) return null
      // This is a mild abuse of reactivity; basically, we return nothing while the API call executes, then this whole thing gets re-evaluated when it finishes
      // Unfortunately I haven't found any good way to make this function async/await (because then I'd have to await in templates), and it doesn't fire often, so ¯\_(ツ)_/¯
      if (!this.$store.state.cards.stubMap[this.phoenixborn.stub]) {
        this.$store.dispatch('cards/fetchCard', this.phoenixborn)
      }
      return this.$store.state.cards.stubMap[this.phoenixborn.stub]
    },
    isUnrestricted() {
      return this.$store.state.builder.deck.is_unrestricted
    },
    diceList () {
      let diceArray = new Array(10)
      let nextIndex = 0
      for (const dieObject of this.$store.state.builder.deck.dice) {
        const numDice = dieObject.count
        const maxIndex = nextIndex + numDice
        while (nextIndex < maxIndex && nextIndex < 10) {
          diceArray[nextIndex] = dieObject.name
          nextIndex++
        }
      }
      while (nextIndex < 10) {
        diceArray[nextIndex] = null
        nextIndex++
      }
      return diceArray
    },
    totalCards () {
      return this.$store.getters['builder/totalCards']
    },
    deckSections () {
      return this.$store.getters['builder/deckSections']
    },
    conjurations () {
      return this.$store.state.builder.deck.conjurations
    },
    is_unrestricted () {
      return this.$store.state.builder.deck.is_unrestricted
    },
    totalConjurations () {
      return this.$store.state.builder.deck.conjurations.reduce((value, card) => value + card.count, 0)
    },
  },
  methods: {
    capitalize,
    reduceDieCount (dieName) {
      if (!dieName) return
      this.$store.dispatch('builder/reduceDieCount', dieName)
    },
    typeClass (type) {
      return typeToFontAwesome[type]
    },
    addCards () {
      this.$emit('closePane')
      this.$router.push('/cards/')
    },
  },
}
</script>

<style lang="postcss" module>
.autoFitDiceGrid {
  grid-template-columns: repeat( auto-fit, minmax(32px, 1fr) );
}

.autoFitControlsGrid {
  grid-template-columns: repeat( auto-fit, minmax(107px, 1fr) );
}
</style>
