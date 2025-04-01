<template>
  <nav role="navigation" aria-label="Site navigation">
    <!-- Referencing the style directly through an inje element is necessary for modular styles to function; otherwise, the template style name doesn't get rewritten. Due to a wrinkle in Vite 2cted $style, we have to use snakeCase instead of hyphens or underscores for class names. -->
    <div class="relative z-10 xl:z-30">
      <div :class="[$style.banner, 'banner', 'h-auto', 'md:h-[70px]',]">
        <div class="container box-border flex flex-col justify-center md:flex-row items-center h-auto md:h-full md:w-full md:justify-between relative">
          <router-link class="h-[40px] my-2 md:height-3/4" to="/">
            <img class="header-logo h-full w-auto" src="./assets/ashes-deckbuilder-logo.png" alt="Ashes Deckbuilder" />
          </router-link>
          <ul class="h-full flex flex-row justify-center items-center text-xs sm:text-lg uppercase mb-2 md:mb-0 md:mt-1">
            <li class="md:py-2 px-2">
              <router-link to="/decks/" class="flex flex-row items-center text-[#8c8c8c]">
                <i
                  class="phg-main-action phg-standalone text-md pr-px inline-block"></i>
                <span class="pl-px">Decks</span>
              </router-link>
            </li>
            <li class="px-2 md:py-2">
              <router-link to="/cards/" class="flex flex-row items-center text-[#8c8c8c]">
                <i
                class="phg-side-action phg-standalone text-md pr-px inline-block"></i>
                <span class="pl-px">Cards</span>
              </router-link>
            </li>
            <li class="pl-2 pr-4 md:py-2">
              <a href="https://www.plaidhatgames.com/board-games/ashes-rise-phoenixborn/" class="flex flex-row items-center text-[#8c8c8c]">
                <i
                class="phg-basic-magic phg-standalone text-md pr-px inline-block"></i>
                <span clafss="pl-px">Ashes Main</span>
              </a>
            </li>
            <li :class="getMyAccountClass">
              <div class="flex flex-row items-center hover:underline cursor-pointer" @click="showingUserMenu = !showingUserMenu">
                <i
                class="fas fa-user text-md pr-1 inline-block text-[#e0b66c]"></i>
                <span class="text-[#1398c3]">My Account</span>
              </div>
            </li>
          </ul>
          <transition name="slide-vertical">
            <div class="absolute right-0 -bottom-[42px] h-[40px] box-border bg-[#e9e9e9] border-solid border-1 border-white" v-if="showingUserMenu">
              <ul v-if="!isAuthenticated" class="flex flex-row items-center h-full box-border px-3 text-xs sm:text-base">
                <li class="diamond-bg pr-10">
                  <link-alike @click="initiateLogin()" use-underline class="text-[#8c8c8c] hover:underline cursor-pointer">
                    Log in
                  </link-alike>
                </li>
                <li class="diamond-bg">
                  <router-link to="/players/new/" class="text-[#8c8c8c] hover:underline cursor-pointer">
                    Sign up
                  </router-link>
                </li>
              </ul>
              <ul v-else class="flex flex-row items-center h-full box-border px-3  text-xs sm:text-base">
                <li class="diamond-bg pr-5 sm:pr-10">
                  <router-link to="/players/me/" class="text-[#8c8c8c]">
                    Settings
                  </router-link>
                </li>
                <li class="diamond-bg pr-5 sm:pr-10">
                  <router-link to="/decks/mine/" class="text-[#8c8c8c]">
                    My decks
                  </router-link>
                </li>
                <li class="diamond-bg pr-5 sm:pr-10">
                  <link-alike use-underline @click="newDeck" class="text-[#1398c3]">
                    New <span v-if="isRedRains">Red Rains</span> deck
                  </link-alike>
                </li>
                <li class="diamond-bg">
                  <link-alike @click="logOut" use-underline class="text-[#8c8c8c]">
                    Log out
                  </link-alike>
                </li>
              </ul>
            </div>
          </transition>
        </div>
      </div>
      <a v-if="$route.path==='/'" href="https://www.kickstarter.com/projects/plaidhatgames/ashes-ascendancy" class="w-full overflow-hidden flex box-border justify-center border-b-solid border-b-[2px] border-b-[#aaaaaa]">
        <img
          :src="getCDNURL('/images/banners/ks.jpg')"
          alt="Ashes Ascendency. Now on Kickstarter"
          class="w-[110%] h-auto max-w-[1920px] flex-shrink-0 lg:w-full"
        />
      </a>
    </div>

    <log-in-modal v-model:open="isLogInModalOpen" @login:success="finalizeLogin(true)" @login:canceled="finalizeLogin(false)">
      <p v-if="onLoginSuccess">Your session has expired. Please login to continue.</p>
    </log-in-modal>
  </nav>
  <div :class="['p-4', 'container', 'mx-auto', 'lg:pt-4', 'flex', 'min-h-[90vh]', 'relative', $route.path !== '/' ? 'xl:mt-6' : '']">
    <div :class="[$style.transitionWidth, isDeckbuilding ? 'xl:w-2/3' : '']">
      <!-- Keying to the route path is necessary, because legacy routes tend to share the same components, and without keying against the path they won't receive standard router lifecycle calls -->
      <router-view :key="$route.path"></router-view>
    </div>
    <transition name="right-sidebar">
      <builder v-if="isDeckbuilding" :class="$style.screenWidth"></builder>
    </transition>
  </div>
  <footer class="footer text-[#aaaaaa] mx-auto p-2 w-full text-center text-xs box-border border-t-solid border-t-[2px] border-t-[#aaaaaa]">
    <p>All images, graphics, textual and game contents &copy; 2015-{{ thisYear }} Plaid Hat Games. All rights reserved. Forked from <a class="text-[#aaaaaa] underline" href="https://github.com/onecrayon/ashes.live" rel="external" target="_blank">ashes.live</a> and <a class="text-[#aaaaaa] underline"href="https://github.com/onecrayon/api.ashes.live" rel="external" target="_blank">api.ashes.live</a>.</p>
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
  return routeObject.meta && routeObject.meta.title && `${routeObject.meta.title} - Ashes Deckbuilder` || 'Ashes Deckbuilder'
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
    showingUserMenu: false,
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
    getMyAccountClass() {
      if(this.showingUserMenu) {
        return "h-full flex flex-row items-center md:border-b md:border-b-solid md:border-b-[6px] md:border-b-[#aaaaaa] md:pt-[6px]";
      }
      return "h-full flex flex-row items-center";
    }
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
      this.showingUserMenu = false;
      this.$store.commit('builder/enable', this.isRedRains)
    },
    getCDNURL(path) {
      return import.meta.env.VITE_CDN_URL + path
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

<style>
.banner {
  position: relative;
  box-sizing: border-box;
  border-bottom: 2px solid #aaaaaa;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background: linear-gradient(to bottom, #c8c8c8 0%, #ffffff 60%);
  background-image: url('./assets/header-bg.png');
  background-repeat: repeat-x;
  background-size: auto 100%;
}
.diamond-bg {
  background: url('/src/assets/icon-diamond-bullet.png') no-repeat;
  background-size: 11px 11px;
  background-position: left center;
  padding-left: 18px;
  box-sizing: border-box;
}
.footer {
  background-image: url('./assets/footer-bg.png');
  background-size: auto 100%;
  background-repeat: repeat-x;
  background-position: top center;
}
</style>

<!-- Specifying the lang as "postcss" isn't strictly necessary, but makes VS Code syntax highlighting work properly -->
<style lang="postcss" module>



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
