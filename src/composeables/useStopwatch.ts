import { onActivatedEntry, onDeactivatedEntry } from '@/stores/storeMap'
import { computed, onScopeDispose, ref } from 'vue'

export function useStopwatch() {
  const totalSeconds = ref(0)
  let id: number = -1

  onActivatedEntry(() => {
    id = setInterval(() => {
      totalSeconds.value += 1
    }, 1_000)
  })

  onDeactivatedEntry(() => {
    clearInterval(id)
  })

  onScopeDispose(() => {
    console.log(`stopwatch disposed! totalSeconds: ${totalSeconds.value}`)
  })

  return {
    seconds: computed(() => totalSeconds.value % 60),
    minutes: computed(() => Math.floor(totalSeconds.value / 60) % 60),
    text: ref(''),
  }
}
