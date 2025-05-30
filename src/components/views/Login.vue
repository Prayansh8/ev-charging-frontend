<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {{ isRegistering ? 'Create your account' : 'Sign in to your account' }}
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Welcome to EV Charging Station Management
        </p>
      </div>
      
      <LoginForm 
        v-if="!isRegistering" 
        @switch-to-register="isRegistering = true" 
      />
      
      <RegisterForm 
        v-else 
        @switch-to-login="isRegistering = false" 
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import LoginForm from '../auth/LoginForm.vue'
import RegisterForm from '../auth/RegisterForm.vue'

const isRegistering = ref(false)
</script>