<template>
  <div class="h-screen flex flex-col">
    <div class="bg-white shadow px-4 py-3 flex items-center justify-between">
      <h1 class="text-2xl font-semibold text-gray-900">Charging Stations Map</h1>
      <div class="flex items-center space-x-2 text-sm text-gray-600">
        <span>{{ stations.length }} stations</span>
      </div>
    </div>
    
    <div v-if="loading" class="flex-1 flex items-center justify-center">
      <LoadingSpinner size="large" />
    </div>
    
    <div v-else class="flex-1 relative">
      <StationMap :stations="stations" />
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useStationsStore } from '../stores/stations'
import StationMap from '../map/StationMap.vue'
import LoadingSpinner from '../common/LoadingSpinner.vue'

const stationsStore = useStationsStore()

const stations = computed(() => stationsStore.stations)
const loading = computed(() => stationsStore.loading)

onMounted(() => {
  stationsStore.fetchStations()
})
</script>