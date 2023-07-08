export type InputElement = HTMLInputElement | HTMLTextAreaElement

export function isInputNode(node?: Node | null): node is InputElement {
  return [HTMLInputElement, HTMLTextAreaElement].some(
    (item) => node instanceof item,
  )
}

const INPUT_SELECTION_CHANGE_DISPOSER_MAP = new Map<HTMLElement, () => void>()

export function createInputSelectionChangeListener<T extends InputElement>(
  node: T,
  callback: (node: T) => void,
) {
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

const INPUT_SELECTIONS = new Map<InputElement, [number, number]>()

let gcWaiting = false

export function inputSelectionsGc() {
  if (gcWaiting || typeof requestIdleCallback === 'undefined') {
    return
  }

  gcWaiting = true

  const gc = () => {
    INPUT_SELECTIONS.forEach((_, node) => {
      if (!node.isConnected) {
        INPUT_SELECTIONS.delete(node)
      }
    })
  }

  requestIdleCallback(() => {
    gc()
    gcWaiting = false
  })
}

/**
 * 内存中缓存 input node 的 selection 信息
 *
 * 返回 disposer 函数
 */
export function cacheInputSelection<T extends InputElement>(node: T) {
  // node 未被选择过
  if (!node.selectionStart || !node.selectionEnd) {
    return
  }

  INPUT_SELECTIONS.set(node, [node.selectionStart, node.selectionEnd])

  // 每次创建新的缓存，都尝试做垃圾回收
  inputSelectionsGc()

  return () => {
    INPUT_SELECTIONS.delete(node)
  }
}

export function restoreInputSelection<T extends InputElement>(node: T) {
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
    throw new TypeError(`node is not instance of InputElement`)
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
