import { defineStore } from 'pinia'
import { authService } from '../services/auth.service'
import router from '../router'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: localStorage.getItem('token'),
    loading: false,
    error: null
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    currentUser: (state) => state.user,
    isLoading: (state) => state.loading
  },

  actions: {
    async login(credentials) {
      this.loading = true
      this.error = null
      
      try {
        const response = await authService.login(credentials)
        this.token = response.token
        this.user = response.data
        localStorage.setItem('token', response.token)
        await router.push('/')
        return { success: true }
      } catch (error) {
        this.error = error.response?.data?.error || 'Login failed'
        throw error
      } finally {
        this.loading = false
      }
    },

    async register(userData) {
      this.loading = true
      this.error = null
      
      try {
        const response = await authService.register(userData)
        this.token = response.token
        this.user = response.data
        localStorage.setItem('token', response.token)
        await router.push('/')
        return { success: true }
      } catch (error) {
        this.error = error.response?.data?.error || 'Registration failed'
        throw error
      } finally {
        this.loading = false
      }
    },

    async checkAuth() {
      if (!this.token) return
      
      try {
        const response = await authService.getCurrentUser()
        this.user = response.data
      } catch (error) {
        this.logout()
      }
    },

    logout() {
        this.user = null
        this.token = null
        this.error = null
        localStorage.removeItem('token')
        router.push('/login')
      },
  
      clearError() {
        this.error = null
      }
    }
  })