export {
  isInputNode,
  createInputSelectionChangeListener,
  cacheInputSelection as saveInputSelection,
  restoreInputSelection,
  createInputCacheSelectionListener,
} from './helpers/input-nodes'

export type { InputNode } from './helpers/input-nodes'

export {
  isContenteditableNode,
  createElementSelectionChangeListener,
  cacheElementSelection,
  restoreElementSelection,
  createElementCacheSelectionListener,
} from './helpers/elements'
