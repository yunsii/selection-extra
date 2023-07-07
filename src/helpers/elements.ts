import { isMarkListened, markListened } from './attributes'

import { MARK_SELECTION_CHANGE_LISTENED_NAME } from '@/constants'

export function isContenteditableNode(node?: Node | null): node is HTMLElement {
  return (
    node instanceof HTMLElement &&
    ['true', 'plaintext-only'].includes(
      node.getAttribute('contenteditable') || 'false',
    )
  )
}

const ELEMENT_SELECTION_CHANGE_DISPOSER_MAP = new Map<HTMLElement, () => void>()

/**
 * 创建 Selection 变更的监听器
 *
 * 通过 selectionchange 监听
 */
export function createElementSelectionChangeListener<T extends HTMLElement>(
  node: T,
  callback: (node: T) => void,
) {
  // 确保 selection change 每个节点只监听一次
  if (isMarkListened(node, MARK_SELECTION_CHANGE_LISTENED_NAME)) {
    return ELEMENT_SELECTION_CHANGE_DISPOSER_MAP.get(node)!
  }

  markListened(node, MARK_SELECTION_CHANGE_LISTENED_NAME)

  const handler = () => {
    const selection = window.getSelection()
    if (!selection) {
      return
    }

    if (
      node.contains(selection.anchorNode) &&
      node.contains(selection.focusNode)
    ) {
      callback(node)
    }
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Document/selectionchange_event
  document.addEventListener('selectionchange', handler)

  const disposer = () => {
    document.removeEventListener('selectionchange', handler)
    ELEMENT_SELECTION_CHANGE_DISPOSER_MAP.delete(node)
  }

  ELEMENT_SELECTION_CHANGE_DISPOSER_MAP.set(node, disposer)
  return ELEMENT_SELECTION_CHANGE_DISPOSER_MAP.get(node)!
}

const CONTENTEDITABLE_SELECTIONS = new Map<HTMLElement, Range[]>()

/**
 * 内存中缓存 contenteditable node 的 selection 信息
 *
 * 返回 disposer 函数
 */
export function cacheElementSelection<T extends HTMLElement>(node: T) {
  const selection = window.getSelection()

  if (!selection) {
    return
  }

  if (selection.rangeCount < 1) {
    return
  }

  // 当前仅火狐支持 Selection 包含多个 Range，
  // 通过 Ctrl/Cmd 多选
  // ref: https://developer.mozilla.org/en-US/docs/Web/API/Selection/rangeCount
  const ranges = Array.from({ length: selection.rangeCount }).map(
    (_, index) => {
      return selection.getRangeAt(index)
    },
  )

  CONTENTEDITABLE_SELECTIONS.set(node, ranges)

  return () => {
    CONTENTEDITABLE_SELECTIONS.delete(node)
  }
}

export function restoreElementSelection<T extends HTMLElement>(node: T) {
  node.focus()

  const cacheRanges = CONTENTEDITABLE_SELECTIONS.get(node)
  if (!cacheRanges) {
    return
  }

  const selection = window.getSelection()

  if (!selection) {
    return
  }

  selection.removeAllRanges()
  cacheRanges.forEach((item) => {
    selection.addRange(item)
  })
}

/**
 * 创建缓存 Selection 的监听器
 */
export function createElementCacheSelectionListener<T extends HTMLElement>(
  node: T,
) {
  if (!(node instanceof HTMLElement)) {
    throw new TypeError(`node is not instance of HTMLElement`)
  }

  const handler = () => {
    cacheElementSelection(node)
  }

  const disposer = createElementSelectionChangeListener(node, handler)

  return {
    disposer,
    restorer: () => restoreElementSelection(node),
  }
}
