export function markListened<T extends HTMLElement>(
  node: T,
  attributeName: string,
) {
  if (!(node instanceof HTMLElement)) {
    return
  }

  node.setAttribute(attributeName, 'true')
}

export function isMarkListened<T extends HTMLElement>(
  node: T,
  attributeName: string,
) {
  if (!(node instanceof HTMLElement)) {
    return false
  }

  if (node.isConnected) {
    return false
  }

  return node.getAttribute(attributeName) === 'true'
}
