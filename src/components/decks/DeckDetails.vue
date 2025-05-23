<template>
  <div v-if="error">
    <h1 class="phg-discard">No deck found</h1>

    <p class="text-lg">
      Sorry, this does not appear to be a valid deck!
    </p>
  </div>
  <div v-else-if="!deck">
    <h1 class="phg-main-action text-gray"><i class="fas fa-circle-notch fa-spin"></i> Loading...</h1>
  </div>
  <div v-else>
    <h1 class="phg-main-action mb-6 pl-px" :class="{'italic font-normal': !deck.title}">{{ title }}</h1>
    <p v-if="deck.is_legacy" class="border-red border-2 rounded bg-red-lightest px-4 py-2 mb-4">
      This is a <strong class="text-red">legacy Ashes 1.0 deck</strong>. It cannot be played using Ashes Reborn cards.
    </p>
    <p
      v-if="showMine"
      class="text-l border-2 rounded px-4 py-2 mb-8"
      :class="{
        'border-inexhaustible-dark bg-inexhaustible': !deck.is_public && deck.is_snapshot,
        'border-reaction-dark bg-reaction': !deck.is_public && !deck.is_snapshot,
        'border-gray bg-gray-light': deck.is_snapshot && deck.is_public,
      }">
      <span v-if="deck.is_snapshot">
        <i class="far fa-eye-slash"></i>
        You are viewing a <strong v-if="!deck.is_public">private</strong><strong v-else>public</strong> snapshot for this deck.
      </span>
      <span v-else>
        <i class="far fa-clock"></i>
        You are viewing your latest private save for this deck.
      </span>
      <router-link v-if="hasPublishedSnapshot" :to="{name: 'DeckDetails', params: {id: sourceId}}">View latest published URL.</router-link>
    </p>
    <div class="lg:flex">
      <div class="mb-4 lg:pl-8 lg:w-1/3 lg:order-2">
        <div class="grid gap-x-2 mb-4" :class="$style.metaGrid">
          <span class="text-gray-darker">Author:</span>
          <player-badge :user="user" />

          <span class="text-gray-darker">Updated:</span>
          <span>{{ lastUpdatedDateFormatted }} ago</span>

        </div>

        <button :disabled="disableBuy()" @click="showBuyDeck = true" class="btn py-1 w-full mb-4">
          <i class="fas fa-cart-plus"></i>
          {{ buyText}}
        </button>
        <buy-deck-modal v-model:open="showBuyDeck" :deck="deck"></buy-deck-modal>


        <button class="btn py-1 w-full mb-4" @click="showTextExport = true">
          <i class="fas fa-share-square"></i>
          Share...
        </button>
        <deck-export-modal v-model:open="showTextExport" :deck="deck"></deck-export-modal>

        <router-link
          v-if="showMine && !deck.is_public"
          :to="`/decks/mine/${sourceId}/history/`"
          class="block hover:no-underline btn py-1 w-full mb-8">
          <i class="fas fa-history"></i>
          Private History
        </router-link>
        <router-link
          v-else
          :to="`/decks/${deck.source_id}/history/`"
          class="block hover:no-underline btn py-1 w-full mb-8">
          <i class="fas fa-history"></i>
          History
        </router-link>

        <!-- Owner's controls -->
        <div v-if="(showMine || user.badge === currentUserBadge) && !deck.is_legacy" class="mb-4">
          <deck-edit-buttons :deck="savedDeck" @deleted="$router.push('/decks/' + (showMine ? '/mine/' : ''))" @refresh="loadDeck()" standalone-buttons></deck-edit-buttons>
        </div>

        <button v-if="isAuthenticated && !deck.is_legacy" class="btn py-1 mb-4 w-full" @click="copyAndEdit(this.deck.is_red_rains)" :disabled="isTalkingToServer">
          <i class="far fa-copy"></i>
          Clone &amp; Edit
        </button>
        <button v-if="isAuthenticated && !deck.is_legacy" class="btn py-1 w-full" @click="copyAndEdit(!this.deck.is_red_rains)" :disabled="isTalkingToServer">
          <i class="fas fa-copy"></i>
          Clone as <span v-if="deck.is_red_rains">PvP</span><span v-else>PvE</span>
        </button>
      </div>
      <div
        class="lg:w-2/3 lg:order-1 flex">
        <div
          v-if="!deck.is_unrestricted"
          class="flex-none bg-no-repeat sm:pl-40"
          :class="$style.minHeight400"
          aria-hidden="true"
          :style="`background-image: url(${phoenixbornImagePath})`"></div>
        <div class="flex-grow pb-4">
          <h2 v-if="deck.is_unrestricted" class="text-3xl">Unrestricted Deck</h2>
          <h2 v-else class="text-3xl">
            <card-link :card="deck.phoenixborn"></card-link>
          </h2>
          <ul v-if="!deck.is_unrestricted" class="mb-2 mt-2 text-xs">
            <strong
            v-if="deck.phoenixborn.battlefield !== undefined"
            class="inline-block border border-red-light px-1">Battlefield {{ deck.phoenixborn.battlefield }}</strong>
            <strong
              v-if="deck.phoenixborn.life !== undefined"
              class="inline-block border border-green-light px-1 mx-1">Life {{ deck.phoenixborn.life }}</strong>
            <strong
              v-if="deck.phoenixborn.spellboard !== undefined"
              class="inline-block border border-blue-dark px-1">Spellboard {{ deck.phoenixborn.spellboard }}</strong>
          </ul>
          <deck-dice class="my-2" :dice="deck.dice" />
          <hr class="mb-4 mt-4" />
          <h3 class="text-lg flex mb-1">
            <span class="flex-grow">Cards</span>
            <span class="flex-none text-sm font-bold" :class="[ cardsCount != 30 ? 'text-red' : 'text-gray-darker']">
              {{ cardsCount }}/{{ deck.is_unrestricted ? '100' : '30' }}
            </span>
          </h3>
          <deck-cards-preview :deck="deck" :columnLayout="true"/>
        </div>
      </div>
    </div>
    <hr class="mb-4">
    <div v-if="deck.description">
      <h2>Description</h2>

      <card-codes :content="deck.description" :is-legacy="deck.is_legacy" needs-paragraphs></card-codes>
    </div>
  </div>
</template>

<script>
import { parseISO, formatDistanceToNowStrict } from 'date-fns'
import { request, getPhoenixbornImageUrl } from '/src/utils/index.js'
import { deckTitle } from '/src/utils/decks.js'
import useHandleResponseError from '/src/composition/useHandleResponseError.js'
import Comments from '../shared/Comments.vue'
import DeckCardsPreview from './DeckCardsPreview.vue'
import DeckDice from './DeckDice.vue'
import DeckExportModal from './DeckExportModal.vue'
import DeckEditButtons from '../shared/DeckEditButtons.vue'
import CardCodes from '../shared/CardCodes.vue'
import PlayerBadge from '../shared/PlayerBadge.vue'
import BuyDeckModal from './BuyDeckModal.vue'

export default {
  name: 'DeckDetails',
  props: ['id'],
  setup () {
    // Standard composite containing { toast, handleResponseError }
    return useHandleResponseError()
  },
  components: {
    CardCodes,
    Comments,
    DeckCardsPreview,
    DeckDice,
    DeckEditButtons,
    DeckExportModal,
    PlayerBadge,
    BuyDeckModal,
  },
  data () {
    return {
      _deck: null,
      last_seen_entity_id: null,
      releases: null,
      hasPublishedSnapshot: false,
      error: false,
      showTextExport: false,
      showBuyDeck: false,
      isTalkingToServer: false,
      products: null,
      productTimer: null,
    }
  },
  beforeMount () {
    this.loadDeck()
    // Watch the edited deck ID since we need to reload if we exit editing on this page
    this.unwatchBuilderId = this.$store.watch(state => state.builder.deck.id, (value, oldValue) => {
      if (oldValue === this._deck.id && value !== oldValue) {
        this.$nextTick(this.loadDeck)
      }
    });

    this.checkProducts();
  },
  beforeUnmount () {
    this.unwatchBuilderId()
    clearTimeout(this.productTimer);
  },
  computed: {
    showMine () {
      return this.$route.meta.showMine
    },
    currentUserBadge () {
      const loggedInUser = this.$store.getters['player/user']
      return (loggedInUser && loggedInUser.badge) || null
    },
    deck () {
      if (this._deck && this.$store.state.builder.deck.id === this._deck.id) return this.$store.state.builder.deck
      return this._deck
    },
    sourceId () {
      if (this.deck.is_snapshot) return this.deck.source_id
      return this.deck.id
    },
    buyText() {
      if(this.products===null) return "Loading products...";
      if(this.products.length===0) return "No products available";
      if(this.deck.is_unrestricted) return "Purchase This Deck";
      if(this.cardsCount!==30) return "Deck is incomplete";
      return "Purchase This Deck";
    },
    savedDeck () {
      // This is the latest save we have loaded; necessary for things like tracking the user and snapshot state
      console.log('savedeck un', this._deck.is_unrestricted);
      return this._deck
    },
    user () {
      // This has to be to the saved version of the deck, because we don't persist it for the builder
      return this.savedDeck.user
    },
    phoenixbornImagePath () {
      return getPhoenixbornImageUrl(this.deck.phoenixborn.stub, true, this.deck.is_legacy)
    },
    lastUpdatedDateFormatted () {
      return formatDistanceToNowStrict(parseISO(this.deck.modified))
    },
    cardsCount () {
      return this.deck.cards.reduce((prev, card) => {
        return prev + card.count
      }, 0)
    },
    formatReleases() {
      const releaseNames = this.releases.map(r => r.name)
      return releaseNames.join(', ')
    },
    title () {
      return deckTitle(this.deck)
    },
    isAuthenticated () {
      return this.$store.getters['player/isAuthenticated']
    },
  },
  methods: {
    checkProducts() {
      this.products = this.$products.products;
      if(this.products===null) {
        this.productTimer = setTimeout(()=>{
          this.checkProducts();
        }, 500);
      } else {
        if(window.location.hash==="#buy") {
          this.showBuyDeck = true;
        }
      }
    },
    loadDeck () {
      const options = {}
      if (this.showMine) {
        options.params = { show_saved: true }
      }
      request(`/v2/decks/${this.id}`, options).then(response => {
        this._deck = response.data.deck
        // Redirect to the public URL if they try to access a public deck through the private link
        if (this._deck.is_public && this.showMine) {
          this.$router.replace(`/decks/${this._deck.id}/`)
        }
        this.releases = response.data.releases
        this.hasPublishedSnapshot = !!response.data.has_published_snapshot
        this.last_seen_entity_id = response.data.last_seen_entity_id
        // And set the site title
        document.title = `${deckTitle(this._deck)} - Ashes Deckbuilder`
      }).catch(error => {
        this.handleResponseError(error)
        this.error = true
      })
    },
    disableBuy() {
      if(this.products===null) return true;
      if(this.products.length===0) return true;
      if(this.deck.is_unrestricted) return false;
      if(this.cardsCount!==30) return true;
      return false;
    },
    copyAndEdit (isRedRains) {
      this.isTalkingToServer = true
      this.$store.dispatch('builder/cloneDeck', { id: this.deck.id, isRedRains }).catch(this.handleResponseError).finally(() => {
        this.isTalkingToServer = false
      })
    },
    toggleSubscription () {
      const method = this.last_seen_entity_id ? "delete" : "post"
      this.isTalkingToServer = true
      request(`/v2/subscription/${this._deck.comments_entity_id}`, {method}).then(response => {
        if (method === "delete") {
          this.last_seen_entity_id = null
          this.toast.info("You have unsubscribed from this deck!")
        } else {
          this.last_seen_entity_id = response.data.last_seen_entity_id
          this.toast.info("You have subscribed to this deck's updates and comments!")
        }
      }).finally(() => {
        this.isTalkingToServer = false
      })
    },
  },
}
</script>

<style lang="postcss" module>
.metaGrid {
  grid-template-columns: auto 1fr;
}

.minHeight400 {
  min-height: 400px;
}
</style>
