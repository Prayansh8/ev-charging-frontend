<template>
  <div class="flex justify-center items-center" :class="containerClass">
    <div class="relative">
      <div
        :class="[
          'animate-spin rounded-full border-b-2',
          sizeClasses[size],
          colorClass
        ]"
      ></div>
      <div
        v-if="showText"
        class="absolute inset-0 flex items-center justify-center"
      >
        <span :class="textSizeClasses[size]" class="text-gray-600">
          {{ text }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  size: {
    type: String,
    default: 'medium',
    validator: (value) => ['small', 'medium', 'large'].includes(value)
  },
  color: {
    type: String,
    default: 'primary'
  },
  text: {
    type: String,
    default: 'Loading...'
  },
  showText: {
    type: Boolean,
    default: false
  },
  fullScreen: {
    type: Boolean,
    default: false
  }
})

const sizeClasses = {
  small: 'h-8 w-8 border-2',
  medium: 'h-12 w-12 border-2',
  large: 'h-16 w-16 border-4'
}

const textSizeClasses = {
  small: 'text-xs',
  medium: 'text-sm',
  large: 'text-base'
}

const colorClass = computed(() => {
  const colors = {
    primary: 'border-blue-600',
    secondary: 'border-gray-600',
    success: 'border-green-600',
    danger: 'border-red-600'
  }
  return colors[props.color] || colors.primary
})

const containerClass = computed(() => {
  return props.fullScreen ? 'fixed inset-0 bg-white bg-opacity-75 z-50' : 'p-4'
})
</script>