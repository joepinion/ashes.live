<template>
  <section
    class="
      transition-transform duration-300 ease-in-out
      fixed top-0 right-0 bottom-0 shadow-md p-8 bg-[#f2f2f2]
      xl:relative xl:inset-auto xl:p-0 xl:pb-4 xl:pl-8 xl:w-1/3 xl:shadow-none z-20"
    :class="{
      'overflow-y-auto': paneOpen,
      'transform translate-x-full shadow-none overflow-visible xl:transform-none': !paneOpen,
    }">
    <div class="flex mb-4">
      <button
        class="xl:hidden text-xl py-2 w-10"
        :class="{
          'absolute top-32 md:top-24 -left-10 shadow-md': !paneOpen,
        }"
        @click="paneOpen = !paneOpen"
        title="Toggle pane"
        ref="toggleButton">
        <i class="fas" :class="{'fa-chevron-double-right': paneOpen, 'fa-chevron-double-left': !paneOpen}"></i>
        <span class="alt-text">Toggle pane</span>
      </button>
      <h2 class="m-0 flex-grow" :class="{'phg-ceremonial-class': !deck.is_red_rains, 'phg-red-rain': deck.is_red_rains}">
        Build your <span v-if="deck.is_red_rains" class="alt-text">Red Rains</span> deck
      </h2>
      <link-alike use-underline @click="exitDeckbuilder" class="fixed top-1 right-2 whitespace-nowrap xl:relative right-6">
          Exit builder <i class="fas fa-times text-xl"></i>
      </link-alike>
      <button
        class="text-3xl pl-2 leading-none"
        :class="{'text-blue': showActions}"
        title="Actions..."
        @click="showActions = !showActions"
        :disabled="noPhoenixborn">
        <i class="fas fa-ellipsis-h"></i><span class="alt-text">Actions... <span v-if="showActions">(open)</span></span>
      </button>
    </div>
    <!-- Once I have an animation; test closing the actions after clicking one -->
    <transition-height>
      <div v-if="showActions" class="text-sm flex flex-wrap justify-end">
        <div class="mb-2 flex-none">
          <button class="btn mr-2">
            <i class="fas fa-balance-scale"></i>
            Legal Mode
          </button>
          <button class="btn btn-first" @click="previewDeck">
            <i class="fas fa-eye"></i>
            Preview
          </button>
          <button class="btn btn-last" @click="exportDeck">
            <i class="fas fa-share-square"></i>
            Share...
          </button>
        </div>
        <div class="ml-2 flex-none">
          <button class="btn btn-first" @click="snapshotDeck(false)">
            <i class="far fa-camera"></i>
            Snapshot...
          </button>
          <button class="btn btn-last btn-green" @click="snapshotDeck(true)" :disabled="cantPublish">
            <i class="far fa-plus-square"></i>
            Publish...
          </button>
        </div>
        <div class="ml-2 flex-none mb-4">
          <button class="btn" :class="{'active': deck.is_red_rains}" @click="toggleRedRains">
            <i class="phg-red-rain"></i> Red Rains
            <span class="alt-text">{{ deck.is_red_rains ? ' (active)' : '' }}</span>
          </button>
        </div>
      </div>
    </transition-height>
    <deck-export-modal v-model:open="showExportModal" :deck="$store.state.builder.deck"></deck-export-modal>
    <deck-snapshot-modal v-model:open="showSnapshotModal" :deck="$store.state.builder.deck" :publish-snapshot="publishSnapshot"></deck-snapshot-modal>
    <div class="flex mb-2">
      <text-input
        class="flex-grow"
        v-model="title"
        :placeholder="placeholderTitle"
        :disabled="noPhoenixborn"
        @blur="saveDeck()"
        @enter="saveDeck(true)"></text-input>
      <button class="flex-none text-3xl pl-2" @click="saveDeck(true)" :disabled="noPhoenixborn" :title="saveAction">
        <i :class="{
          'far fa-circle text-gray': noPhoenixborn,
          'fas fa-circle-notch fa-spin text-gray': isSaving,
          'far fa-check-circle text-green': !noPhoenixborn && !isSaving && !isDirty,
          'far fa-exclamation-circle text-orange': !noPhoenixborn && !isSaving && isDirty,
        }"></i>
      </button>
    </div>
    <div v-if="noPhoenixborn" class="pt-4 text-center">
      <p class="text-lg">
        <link-alike @click="choosePhoenixborn" use-underline use-color>Choose your Phoenixborn</link-alike> to get started!
      </p>
      <p class="text-lg">
        <link-alike @click="chooseUnrestricted" use-underline use-color>Or build an unrestricted deck without rules.</link-alike>
      </p>
    </div>
    <div v-else>
      <div v-if="!editingDescription">
        <div class="mb-2 flex">
          <p class="m-0 text-sm pt-2.5 text-gray" :class="$style.truncatedFlex">
            <span v-if="description">{{ description }}</span>
            <em v-else>No description yet...</em>
          </p>
          <button class="text-3xl text-blue pl-2" title="Edit description..." @click="openDescriptionEditor">
            <i class="far fa-pen-square"></i>
            <span class="alt-text">Edit description...</span>
          </button>
        </div>
      </div>
      <div v-else class="flex">
        <text-editor
          class="flex-grow mb-4"
          v-model="description"
          placeholder="Deck description..."
          @blur="saveDeck()"
          ref="description"></text-editor>
        <div class="pl-2.5">
          <button class="text-3xl text-blue" title="Done editing description" @click="closeDescriptionEditor">
            <i class="far fa-check-square"></i>
            <span class="alt-text">Done editing description</span>
          </button>
        </div>
      </div>
      <builder-deck class="pb-16 xl:pb-0" @close-pane="paneOpen = false"></builder-deck>
    </div>
  </section>
</template>

<script>
import useHandleResponseError from '/src/composition/useHandleResponseError.js'
import BuilderDeck from './BuilderDeck.vue'
import DeckExportModal from './DeckExportModal.vue'
import DeckSnapshotModal from './DeckSnapshotModal.vue'
import LinkAlike from '../shared/LinkAlike.vue'
import TextEditor from '../shared/TextEditor.vue'
import TextInput from '../shared/TextInput.vue'
import TransitionHeight from '../shared/TransitionHeight.vue'

export default {
  name: 'Builder',
  setup () {
    // Standard composite containing { toast, handleResponseError }
    return useHandleResponseError()
  },
  components: {
    BuilderDeck,
    DeckExportModal,
    DeckSnapshotModal,
    LinkAlike,
    TextEditor,
    TextInput,
    TransitionHeight,
  },
  mounted () {
    this.toggleBodyScroll(true)
  },
  data: () => ({
    editingDescription: false,
    showActions: false,
    showExportModal: false,
    showSnapshotModal: false,
    publishSnapshot: false,
    // Tracks whether the deckbuilder pane is open on small screens
    paneOpen: true,
  }),
  computed: {
    deck () {
      return this.$store.state.builder.deck
    },
    title: {
      get () {
        return this.deck.title
      },
      set (value) {
        this.$store.commit('builder/setIsDirty', true)
        this.$store.commit('builder/setTitle', value)
      },
    },
    description: {
      get () {
        return this.$store.state.builder.deck.description
      },
      set (value) {
        this.$store.commit('builder/setIsDirty', true)
        this.$store.commit('builder/setDescription', value)
      },
    },
    placeholderTitle () {
      if (this.deck.phoenixborn) return `Untitled deck`
      return `Untitled Deck`
    },
    noPhoenixborn () {
      return !this.deck.phoenixborn
    },
    isSaving () {
      return this.$store.state.builder.isSaving
    },
    isDirty () {
      return this.$store.state.builder.isDirty
    },
    saveAction () {
      if (this.isSaving) return 'Saving...'
      if (this.noPhoenixborn) return 'Phoenixborn required'
      if (this.isDirty) return 'Save your deck'
      return 'Deck is saved!'
    },
    invalidDeck () {
      if(this.$store.getters['builder/totalDice'] !== 10) return true;
      if(this.$store.getters['builder/totalCards'] !== 30) return true;
      if(this.$store.state.builder.isDirty) return true;
      if(this.$store.state.builder.isSaving) return true;
      return false;
    },
    cantPublish() {
      if(this.deck.is_unrestricted) return false;
      if(this.invalidDeck) return true;
    }
  },
  methods: {
    choosePhoenixborn () {
      this.$router.push({
        name: 'Cards',
        query: { types: ['phoenixborn'] },
      })
      this.paneOpen = false
    },
    chooseUnrestricted() {
      this.$store.dispatch('builder/setUnrestricted', true)
    },
    saveDeck (forceSave = false) {
      if (this.noPhoenixborn || this.isSaving) return
      this.$store.dispatch('builder/SAVE_DECK', { forceSave })
    },
    openDescriptionEditor () {
      this.editingDescription = true
      this.$nextTick(() => {
        this.$refs.description.focus()
      })
    },
    exitDeckbuilder () {
      this.$store.dispatch('builder/reset')
    },
    closeDescriptionEditor () {
      this.editingDescription = false
      this.saveDeck(true)
    },
    previewDeck () {
      this.$router.push({
        name: 'PrivateDeckDetails',
        params: { id: this.deck.id }
      })
      this.showActions = false
      this.paneOpen = false
    },
    exportDeck () {
      this.showExportModal = true
      this.showActions = false
    },
    toggleBodyScroll (paneOpen) {
      // We need to disable scrolling on the body when on mobile
      // Always restore scrolling when turning it off, just to be safe
      const styles = window.getComputedStyle(this.$refs.toggleButton)
      if (styles.display === 'none') return
      if (!paneOpen) {
        document.body.style.overflow = 'auto'
      } else {
        // The toggle button is only shown at screen sizes where the pan actually toggles
        document.body.style.overflow = 'hidden'
      }
    },
    snapshotDeck (publishMode) {
      this.publishSnapshot = publishMode
      this.showSnapshotModal = true
      this.showActions = false
    },
    toggleRedRains () {
      this.$store.commit('builder/setRedRains', !this.deck.is_red_rains)
      this.saveDeck()
    },
  },
  watch: {
    paneOpen (value) {
      this.toggleBodyScroll(value)
    },
  }
}
</script>

<style lang="postcss" module>
.truncatedFlex {
  /* Fun fact: flex-basis of 0% (which is what flex-1 provides in TailwindCSS) breaks single line
     text truncating because it's treated as not having a width. This fixes the issue */
  flex: 1 1 0px;
  @apply truncate;
}
</style>
