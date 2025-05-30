<template>
  <div ref="mapContainer" class="w-full h-full"></div>
  
  <!-- Station Details Popup -->
  <div v-if="selectedStation" class="absolute bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-white rounded-lg shadow-lg p-4 z-[1000]">
    <div class="flex justify-between items-start">
      <h3 class="text-lg font-semibold">{{ selectedStation.name }}</h3>
      <button @click="selectedStation = null" class="text-gray-400 hover:text-gray-600">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>
    </div>
    
    <div class="mt-2 space-y-1 text-sm">
      <p><span class="font-medium">Power Output:</span> {{ selectedStation.powerOutput }}kW</p>
      <p><span class="font-medium">Connector:</span> {{ selectedStation.connectorType }}</p>
      <p><span class="font-medium">Status:</span> 
        <span :class="getStatusClass(selectedStation.status)">{{ selectedStation.status }}</span>
      </p>
      <p><span class="font-medium">Availability:</span> 
        <span :class="getAvailabilityClass(selectedStation.availability)">{{ selectedStation.availability }}</span>
      </p>
      <p v-if="selectedStation.location.address" class="text-gray-600">
        {{ selectedStation.location.address }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const props = defineProps({
  stations: {
    type: Array,
    default: () => []
  }
})

const mapContainer = ref(null)
const map = ref(null)
const markers = ref([])
const selectedStation = ref(null)

// Fix for default markers
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png'
})

onMounted(() => {
  initMap()
})

const initMap = () => {
  map.value = L.map(mapContainer.value).setView([40.7128, -74.0060], 10)
  
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map.value)
  
  updateMarkers()
}

const updateMarkers = () => {
  // Clear existing markers
  markers.value.forEach(marker => marker.remove())
  markers.value = []
  
  // Add new markers
  props.stations.forEach(station => {
    const marker = L.marker([station.location.latitude, station.location.longitude])
      .addTo(map.value)
      .on('click', () => {
        selectedStation.value = station
      })
    
    // Custom popup content
    const popupContent = `
      <div class="p-2">
        <h4 class="font-semibold">${station.name}</h4>
        <p class="text-sm">${station.powerOutput}kW - ${station.connectorType}</p>
      </div>
    `
    marker.bindPopup(popupContent)
    
    markers.value.push(marker)
  })
  
  // Fit map to markers if there are any
  if (markers.value.length > 0) {
    const group = L.featureGroup(markers.value)
    map.value.fitBounds(group.getBounds().pad(0.1))
  }
}

watch(() => props.stations, () => {
  if (map.value) {
    updateMarkers()
  }
}, { deep: true })

const getStatusClass = (status) => {
  const classes = {
    active: 'text-green-600',
    inactive: 'text-gray-600',
    maintenance: 'text-yellow-600'
  }
  return classes[status] || ''
}

const getAvailabilityClass = (availability) => {
  const classes = {
    available: 'text-green-600',
    occupied: 'text-orange-600',
    'out-of-service': 'text-red-600'
  }
  return classes[availability] || ''
}
</script>

<style>
.leaflet-container {
  font-family: inherit;
}
</style>