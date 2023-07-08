import { selectNode } from './nodes'

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

let gcWaiting = false

export function contenteditableSelectionsGc() {
  if (gcWaiting || typeof requestIdleCallback === 'undefined') {
    return
  }

  gcWaiting = true

  const gc = () => {
    CONTENTEDITABLE_SELECTIONS.forEach((_, node) => {
      if (!node.isConnected) {
        CONTENTEDITABLE_SELECTIONS.delete(node)
      }
    })
  }

  requestIdleCallback(() => {
    gc()
    gcWaiting = false
  })
}

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

  // 每次创建新的缓存，都尝试做垃圾回收
  contenteditableSelectionsGc()

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

  cacheRanges.forEach((item) => {
    selectNode(node, item)
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
