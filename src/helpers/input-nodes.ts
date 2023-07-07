import { isMarkListened } from './attributes'

import { MARK_SELECTION_CHANGE_LISTENED_NAME } from '@/constants'

export type InputNode = HTMLInputElement | HTMLTextAreaElement

export function isInputNode(node?: Node | null): node is InputNode {
  return [HTMLInputElement, HTMLTextAreaElement].some(
    (item) => node instanceof item,
  )
}

const INPUT_SELECTION_CHANGE_DISPOSER_MAP = new Map<HTMLElement, () => void>()

export function createInputSelectionChangeListener<T extends InputNode>(
  node: T,
  callback: (node: T) => void,
) {
  // 确保 selection change 每个节点只监听一次
  if (isMarkListened(node, MARK_SELECTION_CHANGE_LISTENED_NAME)) {
    return INPUT_SELECTION_CHANGE_DISPOSER_MAP.get(node)!
  }

  isMarkListened(node, MARK_SELECTION_CHANGE_LISTENED_NAME)

  const handler = () => {
    // ref: https://developer.mozilla.org/en-US/docs/Web/API/Document/activeElement
    if (document.activeElement === node) {
      callback(node)
    }
  }

  // ref: https://developer.mozilla.org/en-US/docs/Web/API/Document/selectionchange_event
  document.addEventListener('selectionchange', handler)

  const disposer = () => {
    document.removeEventListener('selectionchange', handler)
    INPUT_SELECTION_CHANGE_DISPOSER_MAP.delete(node)
  }

  INPUT_SELECTION_CHANGE_DISPOSER_MAP.set(node, disposer)
  return INPUT_SELECTION_CHANGE_DISPOSER_MAP.get(node)!
}

const INPUT_SELECTIONS = new Map<InputNode, [number, number]>()

/**
 * 内存中缓存 input node 的 selection 信息
 *
 * 返回 disposer 函数
 */
export function cacheInputSelection<T extends InputNode>(node: T) {
  // node 未被选择过
  if (!node.selectionStart || !node.selectionEnd) {
    return
  }

  INPUT_SELECTIONS.set(node, [node.selectionStart, node.selectionEnd])

  return () => {
    INPUT_SELECTIONS.delete(node)
  }
}

export function restoreInputSelection<T extends InputNode>(node: T) {
  node.focus()

  const cacheSelection = INPUT_SELECTIONS.get(node)
  if (!cacheSelection) {
    return
  }

  node.selectionStart = cacheSelection[0]
  node.selectionEnd = cacheSelection[1]
}

export function createInputCacheSelectionListener<T extends Node>(
  node?: T | null,
) {
  if (!isInputNode(node)) {
    throw new TypeError(`node is not instance of InputNode`)
  }

  const handler = () => {
    cacheInputSelection(node)
  }

  const disposer = createInputSelectionChangeListener(node, handler)

  return {
    disposer,
    restorer: () => restoreInputSelection(node),
  }
}
