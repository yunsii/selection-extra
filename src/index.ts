import {
  createElementCacheSelectionListener,
  createElementSelectionChangeListener,
} from './helpers/elements'
import {
  createInputCacheSelectionListener,
  createInputSelectionChangeListener,
  isInputNode,
} from './helpers/input-nodes'

export { isInputNode } from './helpers/input-nodes'

export type { InputNode } from './helpers/input-nodes'

export { isContenteditableNode } from './helpers/elements'

export function createSelectionChangeListener<T extends Node>(
  node: T,
  callback: (node: T) => void,
) {
  if (isInputNode(node)) {
    return createInputSelectionChangeListener(node, callback)
  }
  if (node instanceof HTMLElement) {
    return createElementSelectionChangeListener(node, callback)
  }
  throw new TypeError(`nonsupport node type: ${node.nodeType}`)
}

export function createCacheSelectionListener<T extends Node>(node: T) {
  if (isInputNode(node)) {
    return createInputCacheSelectionListener(node)
  }
  if (node instanceof HTMLElement) {
    return createElementCacheSelectionListener(node)
  }
  throw new TypeError(`nonsupport node type: ${node.nodeType}`)
}
