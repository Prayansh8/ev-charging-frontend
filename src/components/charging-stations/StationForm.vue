<template>
  <div class="fixed inset-0 z-50 overflow-y-auto">
    <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <!-- Background overlay -->
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="$emit('close')"></div>

      <!-- Modal panel -->
      <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
        <form @submit.prevent="handleSubmit">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
              {{ isEdit ? 'Edit' : 'Add' }} Charging Station
            </h3>
            
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">Name</label>
                <input
                  v-model="form.name"
                  type="text"
                  required
                  class="input-field"
                />
              </div>
              
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700">Latitude</label>
                  <input
                    v-model.number="form.location.latitude"
                    type="number"
                    step="any"
                    required
                    min="-90"
                    max="90"
                    class="input-field"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700">Longitude</label>
                  <input
                    v-model.number="form.location.longitude"
                    type="number"
                    step="any"
                    required
                    min="-180"
                    max="180"
                    class="input-field"
                  />
                </div>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700">Address (Optional)</label>
                <input
                  v-model="form.location.address"
                  type="text"
                  class="input-field"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700">Power Output (kW)</label>
                <input
                  v-model.number="form.powerOutput"
                  type="number"
                  required
                  min="0"
                  class="input-field"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700">Connector Type</label>
                <select
                  v-model="form.connectorType"
                  required
                  class="input-field"
                >
                  <option value="">Select a type</option>
                  <option v-for="type in connectorTypes" :key="type" :value="type">
                    {{ type }}
                  </option>
                </select>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700">Status</label>
                <select
                  v-model="form.status"
                  required
                  class="input-field"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="maintenance">Maintenance</option>
                </select>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700">Availability</label>
                <select
                  v-model="form.availability"
                  required
                  class="input-field"
                >
                  <option value="available">Available</option>
                  <option value="occupied">Occupied</option>
                  <option value="out-of-service">Out of Service</option>
                </select>
              </div>
            </div>
          </div>
          
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="submit"
              :disabled="loading"
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm disabled:bg-gray-400"
            >
              {{ loading ? 'Saving...' : 'Save' }}
            </button>
            <button
              type="button"
              @click="$emit('close')"
              class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useStationsStore } from '../stores/stations'
import { CONNECTOR_TYPES } from '../utils/constants'

const props = defineProps({
  station: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'saved'])

const stationsStore = useStationsStore()
const connectorTypes = CONNECTOR_TYPES
const loading = ref(false)

const isEdit = computed(() => !!props.station)

const form = ref({
  name: '',
  location: {
    latitude: null,
    longitude: null,
    address: ''
  },
  powerOutput: null,
  connectorType: '',
  status: 'active',
  availability: 'available'
})

onMounted(() => {
  if (props.station) {
    form.value = {
      name: props.station.name,
      location: { ...props.station.location },
      powerOutput: props.station.powerOutput,
      connectorType: props.station.connectorType,
      status: props.station.status,
      availability: props.station.availability
    }
  }
})

const handleSubmit = async () => {
  loading.value = true
  
  try {
    if (isEdit.value) {
      await stationsStore.updateStation(props.station._id, form.value)
    } else {
      await stationsStore.createStation(form.value)
    }
    emit('saved')
  } catch (error) {
    alert('Failed to save station: ' + (error.response?.data?.error || error.message))
  } finally {
    loading.value = false
  }
}
</script>