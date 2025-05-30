<template>
  <div class="py-6">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 class="text-2xl font-semibold text-gray-900">Dashboard</h1>
      
      <!-- Stats Cards -->
      <div class="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="px-4 py-5 sm:p-6">
            <dt class="text-sm font-medium text-gray-500 truncate">
              Total Stations
            </dt>
            <dd class="mt-1 text-3xl font-semibold text-gray-900">
              {{ stats.total }}
            </dd>
          </div>
        </div>
        
        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="px-4 py-5 sm:p-6">
            <dt class="text-sm font-medium text-gray-500 truncate">
              Active Stations
            </dt>
            <dd class="mt-1 text-3xl font-semibold text-green-600">
              {{ stats.active }}
            </dd>
          </div>
        </div>
        
        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="px-4 py-5 sm:p-6">
            <dt class="text-sm font-medium text-gray-500 truncate">
              Available Now
            </dt>
            <dd class="mt-1 text-3xl font-semibold text-blue-600">
              {{ stats.available }}
            </dd>
          </div>
        </div>
        
        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="px-4 py-5 sm:p-6">
            <dt class="text-sm font-medium text-gray-500 truncate">
              Under Maintenance
            </dt>
            <dd class="mt-1 text-3xl font-semibold text-yellow-600">
              {{ stats.maintenance }}
            </dd>
          </div>
        </div>
      </div>

      <!-- Recent Stations -->
      <div class="mt-8">
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-medium text-gray-900">Recent Stations</h2>
          <router-link to="/stations" class="text-sm text-blue-600 hover:text-blue-500">
            View all →
          </router-link>
        </div>
        
        <div v-if="loading" class="mt-4">
          <LoadingSpinner />
        </div>
        
        <div v-else-if="recentStations.length > 0" class="mt-4 bg-white shadow overflow-hidden sm:rounded-md">
          <ul class="divide-y divide-gray-200">
            <li v-for="station in recentStations" :key="station._id" class="px-6 py-4 hover:bg-gray-50">
              <div class="flex items-center justify-between">
                <div class="flex-1">
                  <div class="flex items-center justify-between">
                    <p class="text-sm font-medium text-gray-900">{{ station.name }}</p>
                    <div class="ml-2 flex-shrink-0 flex">
                      <span :class="getStatusClass(station.status)" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                        {{ station.status }}
                      </span>
                    </div>
                  </div>
                  <div class="mt-2 sm:flex sm:justify-between">
                    <div class="sm:flex">
                      <p class="flex items-center text-sm text-gray-500">
                        {{ station.connectorType }} - {{ station.powerOutput }}kW
                      </p>
                    </div>
                    <div class="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                      <p>
                        Added {{ formatDate(station.createdAt) }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
        
        <div v-else class="mt-4 text-center py-12 bg-white rounded-lg">
          <p class="text-gray-500">No charging stations found.</p>
          <router-link to="/stations" class="mt-2 inline-block text-blue-600 hover:text-blue-500">
            Add your first station →
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useStationsStore } from '../stores/stations'
import LoadingSpinner from '../common/LoadingSpinner.vue'

const stationsStore = useStationsStore()

onMounted(() => {
  stationsStore.fetchStations()
})

const loading = computed(() => stationsStore.loading)

const stats = computed(() => {
  const stations = stationsStore.stations
  return {
    total: stations.length,
    active: stations.filter(s => s.status === 'active').length,
    available: stations.filter(s => s.availability === 'available').length,
    maintenance: stations.filter(s => s.status === 'maintenance').length
  }
})

const recentStations = computed(() => {
  return [...stationsStore.stations]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5)
})

const getStatusClass = (status) => {
  const classes = {
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-gray-100 text-gray-800',
    maintenance: 'bg-yellow-100 text-yellow-800'
  }
  return classes[status] || classes.inactive
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffInHours = Math.floor((now - date) / (1000 * 60 * 60))
  
  if (diffInHours < 1) return 'just now'
  if (diffInHours < 24) return `${diffInHours} hours ago`
  if (diffInHours < 48) return 'yesterday'
  
  return date.toLocaleDateString()
}
</script>