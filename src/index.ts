export {
  isInputNode,
  createInputSelectionChangeListener,
  cacheInputSelection as saveInputSelection,
  restoreInputSelection,
  createInputCacheSelectionListener,
} from './helpers/input-nodes'

export type { InputNode } from './helpers/input-nodes'

export {
  createElementSelectionChangeListener,
  cacheElementSelection,
  restoreElementSelection,
  createElementCacheSelectionListener,
} from './helpers/elements'
