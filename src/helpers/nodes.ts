import { isInputNode } from './inputs'

export type SelectableNode = HTMLElement | Text

export function isContenteditableNode(
  node?: SelectableNode | null,
): node is HTMLElement {
  return (
    node instanceof HTMLElement &&
    ['true', 'plaintext-only'].includes(
      node.getAttribute('contenteditable') || 'false',
    )
  )
}

export const contenteditableSelector =
  '[contenteditable="true"], [contenteditable="plaintext-only"]'

export function isContenteditableNodeContains(node?: SelectableNode | null) {
  if (node instanceof Text) {
    const parentElement = node.parentElement
    const editableClosest = parentElement?.closest(contenteditableSelector)
    return isContenteditableNode(parentElement) || !!editableClosest
  }

  return node?.closest(contenteditableSelector)
}

/**
 * 选择 HTMLElement 节点，会判断是否在 contenteditable 节点
 *   - 如果在，则默认 focus 到结尾，可自行定制选择范围
 *   - 如果不在，因为此时节点不能 focus，则默认使用选择整个节点的方式代替，可自行定制选择范围
 */
export function selectNode<T extends HTMLElement>(
  node: T,
  customRange?: [number, number] | Range,
): void

/**
 * 选择 Text 节点，默认 focus 到末尾，可自行定制选择范围
 */
export function selectNode<T extends Text>(
  node: T,
  customRange?: [number, number],
): void

export function selectNode<T extends SelectableNode>(
  node: T,
  customRange?: [number, number] | Range,
) {
  if (isInputNode(node)) {
    node.focus()
    const valueLength = node.value.length

    if (customRange && !(customRange instanceof Range)) {
      node.setSelectionRange(customRange[0], customRange[1])
    } else {
      node.setSelectionRange(valueLength, valueLength)
    }
    return
  }

  const selection = window.getSelection()
  if (!selection) {
    console.warn('getSelection return invalid value')
    return
  }

  // 完全自定义 Range
  if (customRange instanceof Range) {
    selection.removeAllRanges()
    selection.addRange(customRange)
    return
  }

  const range = document.createRange()

  if (node instanceof Text) {
    const textLength = node.length

    if (customRange) {
      range.setStart(node, customRange[0])
      range.setEnd(node, customRange[1])
    } else {
      if (isContenteditableNodeContains(node)) {
        range.setStart(node, textLength)
      } else {
        range.setStart(node, 0)
      }
      range.setEnd(node, textLength)
    }
  } else {
    const childNodesLength = node.childNodes.length

    if (customRange) {
      range.setStart(node, customRange[0])
      range.setEnd(node, customRange[1])
    } else {
      if (isContenteditableNodeContains(node)) {
        range.setStart(node, childNodesLength)
        range.setEnd(node, childNodesLength)
      } else {
        range.setStart(node, 0)
        range.setEnd(node, childNodesLength)
      }
    }
  }

  selection.removeAllRanges()
  selection.addRange(range)
}
