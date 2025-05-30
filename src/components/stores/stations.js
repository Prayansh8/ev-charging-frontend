import { defineStore } from 'pinia'
import { stationsService } from '../services/stations.service'

export const useStationsStore = defineStore('stations', {
  state: () => ({
    stations: [],
    selectedStation: null,
    loading: false,
    error: null,
    filters: {
      status: '',
      powerOutput: '',
      connectorType: '',
      availability: ''
    }
  }),

  getters: {
    filteredStations: (state) => {
      return state.stations.filter(station => {
        // Status filter
        if (state.filters.status && station.status !== state.filters.status) {
          return false
        }
        
        // Power output filter
        if (state.filters.powerOutput) {
          const power = parseInt(state.filters.powerOutput)
          if (station.powerOutput < power - 50 || station.powerOutput > power) {
            return false
          }
        }
        
        // Connector type filter
        if (state.filters.connectorType && station.connectorType !== state.filters.connectorType) {
          return false
        }
        
        // Availability filter
        if (state.filters.availability && station.availability !== state.filters.availability) {
          return false
        }
        
        return true
      })
    },

    totalStations: (state) => state.stations.length,
    
    activeStations: (state) => state.stations.filter(s => s.status === 'active').length,
    
    availableStations: (state) => state.stations.filter(s => s.availability === 'available').length
  },

  actions: {
    async fetchStations() {
      this.loading = true
      this.error = null
      
      try {
        const response = await stationsService.getAllStations()
        this.stations = response.data || []
      } catch (error) {
        this.error = error.response?.data?.error || 'Failed to fetch stations'
        console.error('Error fetching stations:', error)
      } finally {
        this.loading = false
      }
    },

    async fetchStation(id) {
      try {
        const response = await stationsService.getStation(id)
        this.selectedStation = response.data
        return response.data
      } catch (error) {
        this.error = error.response?.data?.error || 'Failed to fetch station'
        throw error
      }
    },

    async createStation(stationData) {
      try {
        const response = await stationsService.createStation(stationData)
        this.stations.push(response.data)
        return response.data
      } catch (error) {
        this.error = error.response?.data?.error || 'Failed to create station'
        throw error
      }
    },

    async updateStation(id, stationData) {
      try {
        const response = await stationsService.updateStation(id, stationData)
        const index = this.stations.findIndex(s => s._id === id)
        if (index !== -1) {
          this.stations[index] = response.data
        }
        return response.data
      } catch (error) {
        this.error = error.response?.data?.error || 'Failed to update station'
        throw error
      }
    },

    async deleteStation(id) {
      try {
        await stationsService.deleteStation(id)
        this.stations = this.stations.filter(s => s._id !== id)
      } catch (error) {
        this.error = error.response?.data?.error || 'Failed to delete station'
        throw error
      }
    },

    setFilters(filters) {
      this.filters = { ...this.filters, ...filters }
    },

    clearFilters() {
      this.filters = {
        status: '',
        powerOutput: '',
        connectorType: '',
        availability: ''
      }
    },

    clearError() {
      this.error = null
    }
  }
})