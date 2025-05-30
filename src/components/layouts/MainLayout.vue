<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Navigation -->
    <nav class="bg-white shadow">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex">
            <!-- Logo -->
            <div class="flex-shrink-0 flex items-center">
              <h1 class="text-xl font-bold text-gray-900">EV Charging Manager</h1>
            </div>
            <!-- Desktop Navigation -->
            <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
              <router-link
                to="/"
                class="nav-link"
                :class="{ 'nav-link-active': $route.name === 'Dashboard' }"
              >
                Dashboard
              </router-link>
              <router-link
                to="/stations"
                class="nav-link"
                :class="{ 'nav-link-active': $route.name === 'Stations' }"
              >
                Stations
              </router-link>
              <router-link
                to="/map"
                class="nav-link"
                :class="{ 'nav-link-active': $route.name === 'MapView' }"
              >
                Map View
              </router-link>
            </div>
          </div>
          
          <!-- User Menu -->
          <div class="flex items-center">
            <div class="flex items-center space-x-4">
              <span class="text-gray-700">{{ user?.name || user?.email }}</span>
              <button
                @click="logout"
                class="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
              >
                Logout
              </button>
            </div>
            
            <!-- Mobile menu button -->
            <div class="flex items-center sm:hidden">
              <button
                @click="mobileMenuOpen = !mobileMenuOpen"
                class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              >
                <svg
                  :class="{ 'hidden': mobileMenuOpen, 'block': !mobileMenuOpen }"
                  class="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                <svg
                  :class="{ 'block': mobileMenuOpen, 'hidden': !mobileMenuOpen }"
                  class="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Mobile menu -->
      <div :class="{ 'block': mobileMenuOpen, 'hidden': !mobileMenuOpen }" class="sm:hidden">
        <div class="pt-2 pb-3 space-y-1">
          <router-link
            to="/"
            @click="mobileMenuOpen = false"
            class="block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
            :class="$route.name === 'Dashboard' ? 'bg-blue-50 border-blue-500 text-blue-700' : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'"
          >
            Dashboard
          </router-link>
          <router-link
            to="/stations"
            @click="mobileMenuOpen = false"
            class="block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
            :class="$route.name === 'Stations' ? 'bg-blue-50 border-blue-500 text-blue-700' : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'"
          >
            Stations
          </router-link>
          <router-link
            to="/map"
            @click="mobileMenuOpen = false"
            class="block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
            :class="$route.name === 'MapView' ? 'bg-blue-50 border-blue-500 text-blue-700' : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'"
          >
            Map View
          </router-link>
        </div>
      </div>
    </nav>

    <!-- Main content -->
    <main>
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()
const mobileMenuOpen = ref(false)

const user = computed(() => authStore.user)

const logout = () => {
  authStore.logout()
}
</script>

<style scoped>
.nav-link {
  @apply inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300 transition-colors duration-200;
}

.nav-link-active {
  @apply border-blue-500 text-gray-900;
}
</style>