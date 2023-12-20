import {
  createElementCacheSelectionListener,
  createElementSelectionChangeListener,
} from './helpers/elements'
import { isInputNode } from './helpers/utils'
import {
  createInputCacheSelectionListener,
  createInputSelectionChangeListener,
} from './helpers/inputs'

export { isInputNode } from './helpers/utils'

export type { InputElement } from './helpers/utils'

export {
  contenteditableSelector,
  selectNode,
  isContenteditableNode,
  isContenteditableNodeContains,
} from './helpers/nodes'

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
