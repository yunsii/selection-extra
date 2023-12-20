export function noop(...args: any[]) {}

export type InputElement = HTMLInputElement | HTMLTextAreaElement

export function isInputNode(node?: Node | null): node is InputElement {
  return [HTMLInputElement, HTMLTextAreaElement].some(
    (item) => node instanceof item,
  )
}
