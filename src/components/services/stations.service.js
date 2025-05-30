import api from './api'

export const stationsService = {
  async getAllStations() {
    const response = await api.get('/charging-stations')
    return response.data
  },

  async getStation(id) {
    const response = await api.get(`/charging-stations/${id}`)
    return response.data
  },

  async createStation(stationData) {
    const response = await api.post('/charging-stations', stationData)
    return response.data
  },

  async updateStation(id, stationData) {
    const response = await api.put(`/charging-stations/${id}`, stationData)
    return response.data
  },

  async deleteStation(id) {
    const response = await api.delete(`/charging-stations/${id}`)
    return response.data
  }
}