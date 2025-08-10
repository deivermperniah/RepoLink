import { reactive } from 'vue'
export const eventBus = reactive({
  listeners: {},
  emit(event, payload) {
    (this.listeners[event] || []).forEach(fn => fn(payload))
  },
  on(event, fn) {
    if (!this.listeners[event]) this.listeners[event] = []
    this.listeners[event].push(fn)
  }
})
