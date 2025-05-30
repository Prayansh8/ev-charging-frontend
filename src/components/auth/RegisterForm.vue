<template>
  <form @submit.prevent="handleSubmit" class="mt-8 space-y-6">
    <Alert v-if="error" type="error" :message="error" @dismiss="clearError" />
    
    <div class="space-y-4">
      <div>
        <label for="name" class="block text-sm font-medium text-gray-700">
          Full Name
        </label>
        <input
          id="name"
          v-model="form.name"
          type="text"
          autocomplete="name"
          required
          :disabled="loading"
          class="mt-1 input-field"
          placeholder="John Doe"
        />
      </div>
      
      <div>
        <label for="register-email" class="block text-sm font-medium text-gray-700">
          Email Address
        </label>
        <input
          id="register-email"
          v-model="form.email"
          type="email"
          autocomplete="email"
          required
          :disabled="loading"
          class="mt-1 input-field"
          placeholder="john@example.com"
        />
      </div>
      
      <div>
        <label for="register-password" class="block text-sm font-medium text-gray-700">
          Password
        </label>
        <input
          id="register-password"
          v-model="form.password"
          type="password"
          autocomplete="new-password"
          required
          :disabled="loading"
          class="mt-1 input-field"
          placeholder="Minimum 6 characters"
        />
        <p v-if="form.password && form.password.length < 6" class="mt-1 text-sm text-red-600">
          Password must be at least 6 characters
        </p>
      </div>
      
      <div>
        <label for="confirm-password" class="block text-sm font-medium text-gray-700">
          Confirm Password
        </label>
        <input
          id="confirm-password"
          v-model="form.confirmPassword"
          type="password"
          autocomplete="new-password"
          required
          :disabled="loading"
          class="mt-1 input-field"
          placeholder="Confirm your password"
        />
        <p v-if="form.confirmPassword && form.password !== form.confirmPassword" class="mt-1 text-sm text-red-600">
          Passwords do not match
        </p>
      </div>
    </div>

    <div>
      <button
        type="submit"
        :disabled="loading || !isFormValid"
        class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
      >
        <span v-if="loading" class="flex items-center">
          <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Creating account...
        </span>
        <span v-else>Sign up</span>
      </button>
    </div>

    <div class="text-center">
      <span class="text-sm text-gray-600">
        Already have an account?
        <button
          type="button"
          @click="$emit('switch-to-login')"
          class="font-medium text-blue-600 hover:text-blue-500"
        >
          Sign in
        </button>
      </span>
    </div>
  </form>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '../stores/auth'
import Alert from '../common/Alert.vue'

const emit = defineEmits(['switch-to-login'])

const authStore = useAuthStore()

const form = ref({
  name: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const loading = ref(false)
const error = ref('')

const isFormValid = computed(() => {
  return form.value.name && 
         form.value.email && 
         form.value.password && 
         form.value.password.length >= 6 &&
         form.value.password === form.value.confirmPassword
})

const clearError = () => {
  error.value = ''
}

const handleSubmit = async () => {
  if (!isFormValid.value) return
  
  loading.value = true
  error.value = ''
  
  try {
    await authStore.register({
      name: form.value.name,
      email: form.value.email,
      password: form.value.password
    })
  } catch (err) {
    error.value = err.response?.data?.error || 'Registration failed. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>