/**
 * @title selectNode
 * @description select any node
 */

/* eslint-disable no-console */

import React, { useRef } from 'react'

import { selectNode } from '../nodes'
import { isInputNode } from '../inputs'

export default function Demo() {
  const nonEditableElementRef = useRef<HTMLDivElement>(null)
  const editableElementRef = useRef<HTMLDivElement>(null)

  function selectText(
    domRef: React.RefObject<HTMLDivElement>,
    range?: [number, number],
  ) {
    const textNode = Array.from(domRef.current?.childNodes || []).find(
      (item) => item instanceof Text,
    ) as Text | null

    if (!textNode) {
      console.log('textNode not found')
      return
    }
    selectNode(textNode, range)
  }

  function selectElement(
    domRef: React.RefObject<HTMLDivElement>,
    range?: [number, number],
  ) {
    const element = Array.from(domRef.current?.childNodes || []).find(
      (item) => !(item instanceof Text),
    ) as HTMLElement | null

    if (!element) {
      console.log('element not found')
      return
    }
    selectNode(element, range)
  }

  function selectInput(
    domRef: React.RefObject<HTMLDivElement>,
    range?: [number, number],
  ) {
    const inputNode = Array.from(domRef.current?.childNodes || []).find(
      (item) => isInputNode(item),
    ) as Text | null

    if (!inputNode) {
      console.log('inputNode not found')
      return
    }
    selectNode(inputNode, range)
  }

  return (
    <div>
      <div>
        <div
          style={{
            border: '1px solid gray',
          }}
          ref={nonEditableElementRef}
        >
          <h1>
            non-contenteditable <span>container</span>
          </h1>
          <h2>foo</h2>
          bar
          <input defaultValue='hello world' />
          <br />
          <strong>hello world</strong>
        </div>
        <div
          contentEditable
          style={{
            border: '1px solid gray',
          }}
          ref={editableElementRef}
        >
          <h1>
            contenteditable <span>container</span>
          </h1>
          <h2>foo</h2>
          bar
          <input defaultValue='hello world' />
          <br />
          <strong>hello world</strong>
        </div>
      </div>
      <div>
        <p>non-contenteditable</p>
        <button
          onClick={() => {
            selectText(nonEditableElementRef)
          }}
        >
          selection text
        </button>
        <button
          onClick={() => {
            selectText(nonEditableElementRef, [0, 2])
          }}
        >
          selection text with [0, 2]
        </button>
        <button
          onClick={() => {
            selectText(nonEditableElementRef, [2, 2])
          }}
        >
          *selection text with [2, 2]
        </button>
        <button
          onClick={() => {
            selectElement(nonEditableElementRef)
          }}
        >
          selection html element
        </button>
        <button
          onClick={() => {
            selectElement(nonEditableElementRef, [1, 2])
          }}
        >
          selection html element with [1, 2]
        </button>
        <br />
        <button
          onClick={() => {
            selectInput(nonEditableElementRef)
          }}
        >
          selection input
        </button>
        <button
          onClick={() => {
            selectInput(nonEditableElementRef, [0, 2])
          }}
        >
          selection input with [0, 2]
        </button>
        <p style={{ margin: 'unset' }}>
          *非 contenteditable 容器 range start/end 值相等时无效果
        </p>
        <br />
        <p>contenteditable</p>
        <button
          onClick={() => {
            selectText(editableElementRef)
          }}
        >
          selection text
        </button>
        <button
          onClick={() => {
            selectText(editableElementRef, [0, 2])
          }}
        >
          selection text with [0, 2]
        </button>
        <button
          onClick={() => {
            selectText(editableElementRef, [2, 2])
          }}
        >
          selection text with [2, 2]
        </button>
        <button
          onClick={() => {
            selectElement(editableElementRef)
          }}
        >
          selection html element
        </button>
        <button
          onClick={() => {
            selectElement(editableElementRef, [1, 2])
          }}
        >
          selection html element with [1, 2]
        </button>
        <br />
        <button
          onClick={() => {
            selectInput(editableElementRef)
          }}
        >
          selection input
        </button>
        <button
          onClick={() => {
            selectInput(editableElementRef, [0, 2])
          }}
        >
          selection input with [0, 2]
        </button>
      </div>
      <br />
      <button
        onClick={() => {
          console.log('getSelection', window.getSelection())
          console.log('document.activeElement', document.activeElement)
        }}
      >
        print selection
      </button>
    </div>
  )
}
