<template>
  <h1 class="phg-illusion-class">
   Import decks from ashes.live
  </h1>

  <div class="sm:flex">
    <div class="sm:flex-grow sm:order-1">
      <!-- Error state -->
      <div v-if="tokenError">
        <strong class="font-bold">Error:&nbsp;</strong>
        <span class="block sm:inline">{{ tokenError }}</span>
      </div>

      <!-- Import completed -->
      <div v-else-if="importComplete" class="py-8">
        <div class="mb-4">
          <h2 class="text-xl font-bold text-green-600 mb-2">
            <span v-if="importProgress.successCount===0">
              No decks were imported.
            </span>
            <span v-else>
              {{ importProgress.successCount }} deck{{ importProgress.successCount === 1 ? '' : 's' }} imported successfully!
            </span>

          </h2>
          <div v-if="importProgress.errors.length > 0" class="mt-4">
            <p class="text-red-600 font-semibold">Errors encountered:</p>
            <ul class="list-disc list-inside text-red-600 mt-2">
              <li v-for="(error, index) in importProgress.errors" :key="index">{{ error }}</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Valid token confirmation -->
      <div v-else-if="isValidToken && !isImporting">
        <div class="mb-4">
          <p class="text-lg text-gray-800 mb-2">
            You are about to import decks to the user account <strong>{{ currentUser.username }}</strong>.
          </p>
          <p class="text-gray-600">
            Are you sure?
          </p>
        </div>

        <button
          @click="beginImport"
          class="btn btn-blue px-4 py-1 mb-4"
          :disabled="isImporting"
        >
          Begin
        </button>
      </div>

      <!-- Import in progress -->
      <div v-else-if="isImporting" class="text-center py-8">
        <p class="text-gray-600">Importing decks, please wait...</p>
        <div v-if="importProgress" class="mt-4 text-sm text-gray-500">
          <p>Progress: {{ importProgress.successCount }} of {{ importProgress.totalCount }} decks imported</p>
        </div>
      </div>

      <!-- Loading state -->
      <div v-else class="text-center py-8">
        <p class="text-gray-600">Validating import token...</p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import { request } from '/src/utils/index.js'
import useHandleResponseError from '/src/composition/useHandleResponseError.js'

export default {
  name: 'PlayerDeckImport',
  setup () {
    const route = useRoute()
    const store = useStore()
    const { toast, handleResponseError } = useHandleResponseError()

    const tokenError = ref(null)
    const isValidToken = ref(false)
    const isImporting = ref(false)
    const importProgress = ref(null)
    const importComplete = ref(false)

    // Get current user from store
    const currentUser = computed(() => store.getters['player/user'])

    // UUID validation regex (RFC 4122 compliant)
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

    const validateToken = () => {
      const token = route.params.token

      if (!token) {
        tokenError.value = 'No import token provided.'
        return
      }

      if (!uuidRegex.test(token)) {
        tokenError.value = 'Invalid import token format. The token must be a valid UUID.'
        return
      }

      // Token is valid UUID format
      isValidToken.value = true
    }

    const beginImport = async () => {
      const token = route.params.token

      isImporting.value = true
      importProgress.value = { totalCount: 0, successCount: 0, errors: [] }

      try {
        let fromDate = null
        let hasMore = true

        while (hasMore) {
          // Build URL with optional parameters
          let url = `/v2/decks/import/${token}`
          const params = new URLSearchParams()

          if (fromDate) {
            params.append('from_date', fromDate)
          }

          // Check for deck_share_uuid query parameter
          const deckShareUuid = route.query.deck_share_uuid
          if (deckShareUuid) {
            params.append('deck_share_uuid', deckShareUuid)
          }

          if (params.toString()) {
            url += `?${params.toString()}`
          }

          const response = await request(url, {
            method: 'get'
          })

          console.log('Import response:', response)

          // Update progress
          importProgress.value.totalCount = response.data.total_count
          importProgress.value.successCount += response.data.success_count
          importProgress.value.errors.push(...response.data.errors)

          // Check if there's more to import
          if (response.data.next_page_from_date) {
            fromDate = response.data.next_page_from_date
          } else {
            hasMore = false
          }
        }

        // Import completed successfully
        importComplete.value = true
      } catch (error) {
        console.error('Import error:', error)

        // Handle 404 specifically - token not found
        if (error.response && error.response.status === 404) {
          tokenError.value = 'Import token was not found on the server.'
        } else {
          // For other errors, show a generic import error message
          tokenError.value = error.response.data.detail || 'An error occurred while importing your decks.'
        }
        isValidToken.value = false
      } finally {
        isImporting.value = false
      }
    }

    onMounted(() => {
      validateToken()
    })

    return {
      tokenError,
      isValidToken,
      isImporting,
      importProgress,
      importComplete,
      currentUser,
      beginImport
    }
  },
}
</script>
