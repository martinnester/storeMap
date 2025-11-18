import { useStopwatch } from '@/composeables/useStopwatch'
import { defineStore } from 'pinia'
import { defineStoreMap } from './storeMap'

export const useStopwatches = defineStore('stopwatches', () => {
  const storeMap = defineStoreMap(
    () => {
      return useStopwatch()
    },
    { keepAlive: 2 },
  )

  return {
    storeMap,
  }
})
