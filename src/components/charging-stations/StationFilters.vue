<template>
  <div class="bg-white p-4 rounded-lg shadow">
    <h3 class="text-lg font-medium text-gray-900 mb-4">Filters</h3>
    
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <div>
        <label class="block text-sm font-medium text-gray-700">Status</label>
        <select
          v-model="filters.status"
          @change="applyFilters"
          class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="maintenance">Maintenance</option>
        </select>
      </div>
      
      <div>
        <label class="block text-sm font-medium text-gray-700">Min Power Output (kW)</label>
        <input
          v-model="filters.powerOutput"
          @input="applyFilters"
          type="number"
          min="0"
          class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          placeholder="e.g., 50"
        />
      </div>
      
      <div>
        <label class="block text-sm font-medium text-gray-700">Connector Type</label>
        <select
          v-model="filters.connectorType"
          @change="applyFilters"
          class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
        >
          <option value="">All Types</option>
          <option v-for="type in connectorTypes" :key="type" :value="type">
            {{ type }}
          </option>
        </select>
      </div>
    </div>
    
    <button
      @click="clearFilters"
      class="mt-4 text-sm text-blue-600 hover:text-blue-800"
    >
      Clear filters
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useStationsStore } from '../stores/stations'
import { CONNECTOR_TYPES } from '../utils/constants'

const stationsStore = useStationsStore()
const connectorTypes = CONNECTOR_TYPES

const filters = ref({
  status: '',
  powerOutput: '',
  connectorType: ''
})

const applyFilters = () => {
  stationsStore.setFilters(filters.value)
}

const clearFilters = () => {
  filters.value = {
    status: '',
    powerOutput: '',
    connectorType: ''
  }
  applyFilters()
}
</script>