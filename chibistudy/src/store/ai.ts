import { create } from 'zustand'
import * as tf from '@tensorflow/tfjs'
import dayjs from 'dayjs'
import { useTasksStore } from './tasks'

type AIState = {
  status: 'idle' | 'training' | 'ready' | 'error'
  lastTrainedAt?: string
  train: () => Promise<void>
  predictForTask: (taskId: string) => Promise<number | null>
  predictAll: () => Promise<void>
}

const MODEL_URL = 'indexeddb://chibistudy-procrastination-model'

function priorityNum(p?: string) {
  if (p === 'high') return 2
  if (p === 'low') return 0
  return 1
}

function featurize(sample: {
  createdAt: string
  dueDate?: string | null
  estimatedMinutes?: number
  priority?: string
}) {
  const created = dayjs(sample.createdAt)
  const due = sample.dueDate ? dayjs(sample.dueDate) : null
  const daysUntilDue = due ? Math.max(0, due.diff(created, 'day', true)) : 7
  const est = Math.max(1, sample.estimatedMinutes ?? 60)
  const pr = priorityNum(sample.priority)
  // features: [bias, est/240, pr/2, daysUntilDue/14]
  return [1, est / 240, pr / 2, Math.min(1, daysUntilDue / 14)]
}

async function loadOrCreateModel(inputDim: number) {
  try {
    const loaded = await tf.loadLayersModel(MODEL_URL)
    return loaded
  } catch {
    const model = tf.sequential()
    model.add(tf.layers.dense({ inputShape: [inputDim], units: 8, activation: 'relu' }))
    model.add(tf.layers.dense({ units: 4, activation: 'relu' }))
    model.add(tf.layers.dense({ units: 1, activation: 'linear' }))
    model.compile({ optimizer: tf.train.adam(0.01), loss: 'meanSquaredError' })
    return model
  }
}

export const useAIStore = create<AIState>((set) => ({
  status: 'idle',
  train: async () => {
    const { items } = useTasksStore.getState()
    const completed = items.filter((t) => (t.actualMinutes ?? 0) > 0)
    if (completed.length < 8) {
      set({ status: 'error' })
      return
    }
    set({ status: 'training' })
    const xs: number[][] = []
    const ys: number[] = []
    for (const t of completed) {
      xs.push(featurize(t))
      const est = Math.max(1, t.estimatedMinutes ?? 60)
      const ratio = Math.max(0.5, Math.min(3, (t.actualMinutes ?? est) / est))
      ys.push(ratio)
    }
    const x = tf.tensor2d(xs)
    const y = tf.tensor2d(ys.map((v) => [v]))
    const model = await loadOrCreateModel(xs[0].length)
    await model.fit(x, y, { epochs: 30, batchSize: 8, shuffle: true, verbose: 0 })
    await model.save(MODEL_URL)
    x.dispose(); y.dispose()
    set({ status: 'ready', lastTrainedAt: new Date().toISOString() })
  },
  predictForTask: async (taskId) => {
    const tasks = useTasksStore.getState()
    const task = tasks.items.find((t) => t.id === taskId)
    if (!task) return null
    try {
      const model = await tf.loadLayersModel(MODEL_URL)
      const x = tf.tensor2d([featurize(task)])
      const pred = model.predict(x) as tf.Tensor
      const val = (await pred.data())[0]
      x.dispose(); pred.dispose()
      const score = Math.max(0.5, Math.min(3, val))
      await tasks.update(taskId, { procrastinationScore: score })
      return score
    } catch {
      return null
    }
  },
  predictAll: async () => {
    const tasks = useTasksStore.getState()
    for (const t of tasks.items) {
      await useAIStore.getState().predictForTask(t.id)
    }
  },
}))

