<template>
  <transition
    enter-active-class="transition ease-out duration-300"
    enter-from-class="transform opacity-0 scale-95"
    enter-to-class="transform opacity-100 scale-100"
    leave-active-class="transition ease-in duration-200"
    leave-from-class="transform opacity-100 scale-100"
    leave-to-class="transform opacity-0 scale-95"
  >
    <div
      v-if="visible"
      :class="[
        'p-4 rounded-md',
        typeClasses[type]
      ]"
    >
      <div class="flex">
        <div class="flex-shrink-0">
          <component :is="iconComponent" class="h-5 w-5" aria-hidden="true" />
        </div>
        <div class="ml-3 flex-1">
          <p class="text-sm font-medium">
            {{ message }}
          </p>
        </div>
        <div v-if="dismissible" class="ml-auto pl-3">
          <button
            @click="dismiss"
            class="-mx-1.5 -my-1.5 rounded-lg p-1.5 inline-flex h-8 w-8 hover:bg-black hover:bg-opacity-10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            <span class="sr-only">Dismiss</span>
            <XMarkIcon class="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { 
  CheckCircleIcon, 
  ExclamationCircleIcon, 
  XCircleIcon,
  InformationCircleIcon,
  XMarkIcon 
} from '@heroicons/vue/24/solid'

const props = defineProps({
  type: {
    type: String,
    default: 'info',
    validator: (value) => ['success', 'error', 'warning', 'info'].includes(value)
  },
  message: {
    type: String,
    required: true
  },
  dismissible: {
    type: Boolean,
    default: true
  },
  duration: {
    type: Number,
    default: 0 // 0 means no auto-dismiss
  }
})

const emit = defineEmits(['dismiss'])

const visible = ref(true)

const typeClasses = {
  success: 'bg-green-50 text-green-800 border border-green-200',
  error: 'bg-red-50 text-red-800 border border-red-200',
  warning: 'bg-yellow-50 text-yellow-800 border border-yellow-200',
  info: 'bg-blue-50 text-blue-800 border border-blue-200'
}

const iconComponent = computed(() => {
  const icons = {
    success: CheckCircleIcon,
    error: XCircleIcon,
    warning: ExclamationCircleIcon,
    info: InformationCircleIcon
  }
  return icons[props.type]
})

const dismiss = () => {
  visible.value = false
  emit('dismiss')
}

// Auto-dismiss after duration
if (props.duration > 0) {
  setTimeout(() => {
    dismiss()
  }, props.duration)
}

// Watch for message changes to show alert again
watch(() => props.message, () => {
  visible.value = true
})
</script>