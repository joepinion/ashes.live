<template>
  <nav role="navigation" aria-label="Site navigation">
    <!-- Referencing the style directly through an injected $style element is necessary for modular styles to function; otherwise, the template style name doesn't get rewritten. Due to a wrinkle in Vite 2, we have to use snakeCase instead of hyphens or underscores for class names. -->
    <div class="bg-inexhaustible" :class="[useFullHeader ? $style.fullHeader : '']">
      <div :class="$style.banner">
        <ul
          class="container mx-auto grid items-center text-center py-2 px-4 gap-x-10 grid-rows-2 md:grid-rows-1"
          :class="[$style.headerCols, useFullHeader ? 'lg:py-4' : '']">
          <li class="col-start-1 col-span-3 row-start-1 md:col-start-2 md:col-span-1">
            <router-link to="/" :class="$style.homeLink">Ashes.live</router-link>
          </li>
          <li
            class="col-start-1 row-start-2 justify-self-start md:row-start-1"
            :class="[useFullHeader ? 'lg:justify-self-end' : '']">
            <router-link to="/decks/" class="inline-block text-black leading-tight">
              <i
                class="phg-main-action phg-standalone text-2xl pr-2 inline-block"
                :class="[useFullHeader ? 'lg:block lg:pr-0' : '']"></i>
              <span class="text-lg">Decks</span>
            </router-link>
          </li>
          <li
            class="col-start-3 row-start-2 justify-self-end md:row-start-1"
            :class="[useFullHeader ? 'lg:justify-self-start' : '']">
            <router-link to="/cards/" class="inline-block text-black leading-tight">
              <i
                class="phg-side-action phg-standalone text-2xl pr-2 inline-block"
                :class="[useFullHeader ? 'lg:block lg:pr-0' : '']"></i>
              <span class="text-lg">Cards</span>
            </router-link>
          </li>
        </ul>
      </div>
    </div>
    <div class="px-4 container mx-auto">
      <transition name="slide-vertical">
        <ul v-if="!isAuthenticated" class="flex py-1">
          <li class="flex-initial px-2">
            <link-alike @click="initiateLogin()" use-underline>
              <i class="fas fa-user-secret text-xl"></i> Log in
            </link-alike>
          </li>
          <li class="flex-initial px-2">
            <router-link to="/players/new/" class="text-black">
              <i class="fas fa-user-plus text-xl"></i> Sign up
            </router-link>
          </li>
        </ul>
        <div v-else class="flex py-1">
          <ul class="flex flex-wrap flex-grow">
            <li class="flex-none px-2">
              <router-link to="/players/me/" class="text-black">
                <i class="fas fa-user text-xl"></i>
                {{ myUsername }}<span class="text-gray">#{{ myBadge }}</span>
              </router-link>
            </li>
            <li class="flex-none px-2">
              <router-link to="/decks/mine/" class="text-black">
                <i class="fas fa-th-list text-xl"></i> My decks
              </router-link>
            </li>
            <li class="flex-none px-2">
              <link-alike @click="logOut" use-underline>
                <i class="fas fa-user-slash text-xl"></i> Log out
              </link-alike>
            </li>
          </ul>
          <div class="flex-none relative">
            <transition name="slide-vertical">
              <link-alike v-if="isDeckbuilding" use-underline @click="exitDeckbuilder" class="right-0 whitespace-nowrap">
                <i class="fas fa-times text-xl"></i> Exit builder
              </link-alike>
              <link-alike v-else use-underline @click="newDeck" class="right-0 whitespace-nowrap">
                <i class="fas fa-plus text-xl"></i> New <span v-if="isRedRains">Red Rains</span> deck
              </link-alike>
            </transition>
          </div>
        </div>
      </transition>
    </div>
    <log-in-modal v-model:open="isLogInModalOpen" @login:success="finalizeLogin(true)" @login:canceled="finalizeLogin(false)">
      <p v-if="onLoginSuccess">Your session has expired. Please login to continue.</p>
    </log-in-modal>
  </nav>
  <div class="p-4 container mx-auto lg:pt-8 flex relative">
    <div :class="[$style.transitionWidth, isDeckbuilding ? 'xl:w-2/3' : '']">
      <!-- Keying to the route path is necessary, because legacy routes tend to share the same components, and without keying against the path they won't receive standard router lifecycle calls -->
      <router-view :key="$route.path"></router-view>
    </div>
    <transition name="right-sidebar">
      <builder v-if="isDeckbuilding" :class="$style.screenWidth"></builder>
    </transition>
  </div>
  <footer class="container mx-auto p-4 pt-10 text-center text-xs">
    <p>All images, graphics, textual and game contents &copy; 2015-{{ thisYear }} Plaid Hat Games. All rights reserved.</p>
    <p>Forked from <a href="https://github.com/onecrayon/ashes.live" rel="external" target="_blank">ashes.live</a> and <a href="https://github.com/onecrayon/api.ashes.live" rel="external" target="_blank">api.ashes.live</a>.</p>
  </footer>
</template>

<script>
import axios from 'axios'
import { useToast } from 'vue-toastification'
import LogInModal from './components/LogInModal.vue'
import Builder from './components/decks/Builder.vue'
import LinkAlike from './components/shared/LinkAlike.vue'
import emitter from './events.js'

// Set up sensible Axios defaults for query string array handling
// (`null` means "don't show brackets")
axios.defaults.paramsSerializer = {indexes: null}

function siteTitle(routeObject) {
  // Returns the title that should be used based on the $route object
  return routeObject.meta && routeObject.meta.title && `${routeObject.meta.title} - Ashes.live` || 'Ashes.live'
}

export default {
  name: 'App',
  setup () {
    // Expose toasts for use in other portions of this component
    return { toast: useToast() }
  },
  components: {
    Builder,
    LinkAlike,
    LogInModal,
  },
  data: () => ({
    isLogInModalOpen: false,
    onLoginSuccess: null,
    onLoginFailure: null,
  }),
  created () {
    // Set the page title when the app is loaded for the first time
    document.title = siteTitle(this.$route)
  },
  mounted () {
    emitter.on('login:required', this.initiateLogin)
  },
  beforeUnmount () {
    emitter.off('login:required', this.initiateLogin)
  },
  computed: {
    useFullHeader () {
      return this.$route.name === 'Home' || this.$route.name === 'NotFound'
    },
    thisYear () {
      return (new Date()).getFullYear()
    },
    isAuthenticated () {
      return this.$store.getters['player/isAuthenticated']
    },
    myUsername () {
      return this.$store.state.player.username
    },
    myBadge () {
      return this.$store.state.player.badge
    },
    isDeckbuilding () {
      return this.$store.state.builder.enabled
    },
    isRedRains () {
      return !!this.$route.meta.showRedRains
    },
  },
  watch: {
    $route(to, from) {
      // Set the page title when we navigate to a new page
      document.title = siteTitle(to)
      this.isLogInModalOpen = false
    },
  },
  methods: {
    newDeck () {
      this.$store.commit('builder/enable', this.isRedRains)
    },
    exitDeckbuilder () {
      this.$store.dispatch('builder/reset')
    },
    initiateLogin ({onSuccess = null, onFailure = null} = {}) {
      this.onLoginSuccess = onSuccess
      this.onLoginFailure = onFailure
      this.isLogInModalOpen = true
    },
    finalizeLogin(isSuccess) {
      if (isSuccess && this.onLoginSuccess) {
        this.onLoginSuccess()
      } else if (!isSuccess && this.onLoginFailure) {
        this.onLoginFailure()
      }
      this.onLoginSuccess = null
      this.onLoginFailure = null
    },
    logOut () {
      this.$store.dispatch('player/logOut')
      this.toast.info('You have logged out!')
      if (this.$route.meta.needsAuth) {
        this.$router.push('/')
      }
    },
  },
}
</script>

<!-- Specifying the lang as "postcss" isn't strictly necessary, but makes VS Code syntax highlighting work properly -->
<style lang="postcss" module>
.banner {
  position: relative;

  /* This creates the bottom "border" of the main header */
  &::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: 0;
    height: 0;
    width: 100%;
    border-top: 1px solid var(--color-white);
    border-bottom: 3px solid var(--color-gray);
  }
}

.headerCols {
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr);
}

.homeLink {
  background: url('./assets/ashes-live-small.png') left top no-repeat;
  display: inline-block;
  height: 0px;
  width: 266px;
  padding-top: 30px;
  overflow: hidden;
}

.screenWidth {
  width: 100vw;
}

@media (min-width: 768px) {
  .screenWidth {
    width: 640px;
  }
}

@media (min-width: 1024px) {
  .fullHeader .homeLink {
    background-image: url('./assets/ashes-live.png');
    width: 366px;
    padding-top: 107px;
    margin-top: 8px;
    /* Adjust it downward so that we overlap the border; this equates to 45px at base 16 */
    margin-bottom: -2.8125rem;
    position: relative;
    z-index: 10;
  }

  .headerCols {
    grid-template-columns: minmax(0, 1fr) 366px minmax(0, 1fr);
  }
}

.transitionWidth {
  @apply w-full;
  transition: width .25s ease-in-out .15s;
}
</style>
