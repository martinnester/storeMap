# storeMap
This repository is an example use case of [defineStoreMap (click to see file)](stores/storeMap.ts). It provides a utility similiar to pinia's "defineStore" but allows instantiating multiple instances based off an arbitrary key, and provides mechnism very similar to (vue KeepAlive built-in component)[https://vuejs.org/guide/built-ins/keep-alive]. The example is kind of arbitary, there are a five text inputs that when changed will call `useStopwatches().storeMap.use(() => key.value)` [here](src/StopWatch.vue) where `key.value` is what you inputed.

# example walk-through
Type in `foo` in the first input and after bluring the input you will see a new timer/stopwatch. Type the same text in the second feild and blur, notice they are in sync! You can enter a different keys in other inputs for separate timers. You may be curious about the aforementioned "keep alive" mechanism... What if you remove all references to a given key? Don't worry! They will be cached. However, in this example when `defineStoreMap` was called it was configured to only cache 2 instances.

# How is this helpful?
- Allows implementations to be concerned with one single instance of a given entity, instead of trying to orchestrate different pieces of unorganized global state.
- Provides `onDeactivatedEntry` and `onActivatedEntry` synonomous with the [KeepAlive life cycle hooks](https://vuejs.org/guide/built-ins/keep-alive.html#lifecycle-of-cached-instance). This is used in the example to pause stopwatches when they are not visible.
- Uses an effect scope, so that when an entry is removed from the cache then side effect cleanup is automatic. For example, you may use [useSubscription](https://vueuse.org/rxjs/useSubscription/) from `@vueuse/core` to subscripe to a STOMP web socket topic, and if you use it with in the `setup` fuction of the `defineStoreMap` it will automatically be cleaned up.
