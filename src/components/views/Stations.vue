<template>
  <div class="py-6">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center">
        <h1 class="text-2xl font-semibold text-gray-900">Charging Stations</h1>
        <button @click="showForm = true" class="btn-primary">
          <PlusIcon class="h-5 w-5 mr-2 inline" />
          Add New Station
        </button>
      </div>

      <!-- Filters -->
      <StationFilters class="mt-6" />

      <!-- Error Alert -->
      <Alert 
        v-if="error" 
        type="error" 
        :message="error" 
        class="mt-4"
        @dismiss="stationsStore.clearError" 
      />

      <!-- Loading State -->
      <LoadingSpinner v-if="loading" class="mt-8" />

      <!-- Station List -->
      <div v-else-if="filteredStations.length > 0" class="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <StationCard
          v-for="station in filteredStations"
          :key="station._id"
          :station="station"
          @edit="editStation"
          @delete="deleteStation"
        />
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-12 mt-8">
        <svg
          class="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
          />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">No charging stations</h3>
        <p class="mt-1 text-sm text-gray-500">
          {{ stationsStore.filters.status || stationsStore.filters.connectorType ? 'Try adjusting your filters' : 'Get started by creating a new charging station.' }}
        </p>
        <div class="mt-6">
          <button
            v-if="stationsStore.filters.status || stationsStore.filters.connectorType"
            @click="stationsStore.clearFilters"
            class="btn-secondary"
          >
            Clear Filters
          </button>
          <button
            v-else
            @click="showForm = true"
            class="btn-primary"
          >
            <PlusIcon class="h-5 w-5 mr-2 inline" />
            Add New Station
          </button>
        </div>
      </div>

      <!-- Station Form Modal -->
      <StationForm
        v-if="showForm"
        :station="selectedStation"
        @close="closeForm"
        @saved="onStationSaved"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useStationsStore } from '../stores/stations'
import { PlusIcon } from '@heroicons/vue/24/solid'
import StationCard from '../charging-stations/StationCard.vue'
import StationFilters from '../charging-stations/StationFilters.vue'
import StationForm from '../charging-stations/StationForm.vue'
import LoadingSpinner from '../common/LoadingSpinner.vue'
import Alert from '../common/Alert.vue'

const stationsStore = useStationsStore()

const showForm = ref(false)
const selectedStation = ref(null)

const loading = computed(() => stationsStore.loading)
const error = computed(() => stationsStore.error)
const filteredStations = computed(() => stationsStore.filteredStations)

onMounted(() => {
  stationsStore.fetchStations()
})

const editStation = (station) => {
  selectedStation.value = station
  showForm.value = true
}

const deleteStation = async (id) => {
  if (confirm('Are you sure you want to delete this charging station? This action cannot be undone.')) {
    try {
      await stationsStore.deleteStation(id)
    } catch (error) {
      console.error('Failed to delete station:', error)
    }
  }
}

const closeForm = () => {
  showForm.value = false
  selectedStation.value = null
}

const onStationSaved = () => {
  closeForm()
  stationsStore.fetchStations()
}
</script>