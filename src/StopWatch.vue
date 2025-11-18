<template>
  <div>
    <input
      type="text"
      v-model="inputValue"
      :style="{ width: inputWidth }"
      @change="key = inputValue"
    />: {{ stopwatch.minutes }}m {{ stopwatch.seconds }}s
    <input type="text" v-model="stopwatch.text" />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useStopwatches } from './stores/stopwatches'

const key = ref('foo')
const inputValue = ref(key.value)
const stopwatch = useStopwatches().storeMap.use(() => key.value)
const inputWidth = computed(() => `${Math.max(inputValue.value.length, 2)}ch`)
</script>

<style scoped>
input {
  width: fit-content;
  min-width: 0;
}
</style>
