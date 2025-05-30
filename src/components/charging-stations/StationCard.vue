<template>
  <div class="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow duration-200">
    <div class="px-4 py-5 sm:p-6">
      <h3 class="text-lg font-medium text-gray-900 mb-2">{{ station.name }}</h3>
      
      <div class="space-y-2">
        <div class="flex items-center text-sm text-gray-500">
          <MapPinIcon class="h-4 w-4 mr-1" />
          <span>{{ formatLocation(station.location) }}</span>
        </div>
        
        <div class="flex items-center text-sm text-gray-500">
          <BoltIcon class="h-4 w-4 mr-1" />
          <span>{{ station.powerOutput }}kW - {{ station.connectorType }}</span>
        </div>
        
        <div class="flex items-center space-x-2 mt-3">
          <span :class="getStatusClass(station.status)" class="text-xs px-2 py-1 rounded-full">
            {{ station.status }}
          </span>
          <span :class="getAvailabilityClass(station.availability)" class="text-xs px-2 py-1 rounded-full">
            {{ station.availability }}
          </span>
        </div>
      </div>
      
      <div class="mt-4 flex space-x-2">
        <button @click="$emit('edit', station)" class="btn-secondary text-sm flex-1">
          <PencilIcon class="h-4 w-4 mr-1 inline" />
          Edit
        </button>
        <button @click="$emit('delete', station._id)" class="btn-danger text-sm flex-1">
          <TrashIcon class="h-4 w-4 mr-1 inline" />
          Delete
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { MapPinIcon, BoltIcon, PencilIcon, TrashIcon } from '@heroicons/vue/24/solid'

const props = defineProps({
  station: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['edit', 'delete'])

const formatLocation = (location) => {
  if (location.address) {
    return location.address
  }
  return `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`
}

const getStatusClass = (status) => {
  const classes = {
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-gray-100 text-gray-800',
    maintenance: 'bg-yellow-100 text-yellow-800'
  }
  return classes[status] || classes.inactive
}

const getAvailabilityClass = (availability) => {
  const classes = {
    available: 'bg-green-100 text-green-800',
    occupied: 'bg-orange-100 text-orange-800',
    'out-of-service': 'bg-red-100 text-red-800'
  }
  return classes[availability] || classes['out-of-service']
}
</script>