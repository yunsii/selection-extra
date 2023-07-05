export type InputNode = HTMLInputElement | HTMLTextAreaElement

export function isInputNode(node?: Node | null): node is InputNode {
  return [HTMLInputElement, HTMLTextAreaElement].some(
    (item) => node instanceof item,
  )
}

export function createInputSelectionChangeListener<T extends Node>(
  node: T,
  callback: (node: T) => void,
) {
  if (!isInputNode(node)) {
    return
  }

  const handler = (event: Event) => {
    if (document.activeElement === node) {
      callback(node)
    }
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Document/selectionchange_event
  document.addEventListener('selectionchange', handler)

  return () => {
    document.removeEventListener('selectionchange', handler)
  }
}

const DEFAULT_INPUT_SELECTION_KEY = 'selection-unique'
const INPUT_SELECTIONS: Record<string, [number, number]> = {}

/** 内存中缓存 input node 的 selection 信息，可根据 key 存储不同的信息，默认信息具有唯一性 */
export function saveInputSelection<T extends Node>(
  node: T,
  key = DEFAULT_INPUT_SELECTION_KEY,
) {
  if (!isInputNode(node)) {
    return
  }

  // node 未被选择过
  if (!node.selectionStart || !node.selectionEnd) {
    return
  }

  INPUT_SELECTIONS[key] = [node.selectionStart, node.selectionEnd]
}

export function restoreInputSelection<T extends Node>(
  node?: T | null,
  key = DEFAULT_INPUT_SELECTION_KEY,
) {
  if (!isInputNode(node)) {
    return
  }

  const cacheSelection = INPUT_SELECTIONS[key]

  node.focus()

  if (!cacheSelection) {
    return
  }

  node.selectionStart = cacheSelection[0]
  node.selectionEnd = cacheSelection[1]
}

export function createSaveInputSelectionListener<T extends Node>(
  node?: T | null,
  key = DEFAULT_INPUT_SELECTION_KEY,
) {
  if (!isInputNode(node)) {
    return
  }

  const handler = () => {
    saveInputSelection(node, key)
  }

  node.addEventListener('blur', handler)

  return () => {
    node.removeEventListener('blur', handler)
  }
}
