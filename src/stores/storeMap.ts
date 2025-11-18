import { reactiveComputed } from '@vueuse/core'
import {
  EffectScope,
  effectScope,
  type MaybeRefOrGetter,
  onScopeDispose,
  type Reactive,
  reactive,
  shallowReactive,
  shallowRef,
  toValue,
  watch,
} from 'vue'

interface EntryCallbacks {
  onActivatedEntryCallbacks: (() => void)[]
  onDeactivatedEntryCallbacks: (() => void)[]
}

interface Entry<State extends object> extends EntryCallbacks {
  count: number
  state: Reactive<State>
  scope: EffectScope
}

let currentEntryCallbacks: EntryCallbacks | undefined = undefined

export function onActivatedEntry(callback: () => void) {
  if (currentEntryCallbacks) {
    currentEntryCallbacks.onActivatedEntryCallbacks.push(callback)
    return true
  }
  return false
}

export function onDeactivatedEntry(callback: () => void) {
  if (currentEntryCallbacks) {
    currentEntryCallbacks.onDeactivatedEntryCallbacks.push(callback)
    return true
  }
  return false
}

export function defineStoreMap<State extends object>(
  setup: (key: string) => State,
  options?: { keepAlive?: number },
) {
  const keepAlive: number = Math.max(options?.keepAlive ?? 0, 0)
  const data = shallowReactive<Record<string, Entry<State>>>({})
  const keptAlive = shallowRef<string[]>([])
  return reactive({
    data,
    keptAlive,
    use(key: MaybeRefOrGetter<string>) {
      const cleanUp = (k: string) => {
        const value = data[k]!
        value.count -= 1
        if (value.count === 0) {
          value.onDeactivatedEntryCallbacks.forEach((f) => f())
          keptAlive.value.unshift(k)
          if (keptAlive.value.length > keepAlive) {
            const poppedKey = keptAlive.value.pop()!
            const value2 = data[poppedKey]!
            value2.scope.stop()
            delete data[poppedKey]
          }
        }
      }
      watch(
        () => toValue(key),
        (newKey, oldKey) => {
          if (oldKey) {
            cleanUp(oldKey)
          }
          const scope = effectScope()
          const entryCallbacks: EntryCallbacks = {
            onActivatedEntryCallbacks: [],
            onDeactivatedEntryCallbacks: [],
          }
          const value = (data[newKey] ??= {
            ...entryCallbacks,
            count: 0,
            state: scope.run(() => {
              if (currentEntryCallbacks) {
                console.warn('Nesting is not supported with storeMaps')
              }
              currentEntryCallbacks = entryCallbacks
              const res = reactive(setup(newKey))
              currentEntryCallbacks = undefined
              return res
            })!,
            scope,
          })
          keptAlive.value = keptAlive.value.filter((k) => newKey !== k)
          if (value.count === 0) {
            value.onActivatedEntryCallbacks.forEach((f) => f())
          }
          value.count += 1
        },
        { immediate: true },
      )
      onScopeDispose(() => {
        cleanUp(toValue(key))
      })
      return reactiveComputed(() => data[toValue(key)]!.state)
    },
  })
}
