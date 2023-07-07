/**
 * @title contenteditable
 * @description selection with contenteditable
 */

/* eslint-disable no-console */

import React, { useEffect, useRef } from 'react'
import {
  createCacheSelectionListener,
  createSelectionChangeListener,
} from 'selection-extra'

export default function Demo() {
  const divRef = useRef<HTMLDivElement>(null)
  const divRestorerRef = useRef<() => void>()
  const divEditableRef = useRef<HTMLDivElement>(null)
  const divEditableRestorerRef = useRef<() => void>()

  useEffect(() => {
    const divNode = divRef.current

    if (!divNode) {
      return
    }

    const { disposer, restorer } = createCacheSelectionListener(divNode)

    divRestorerRef.current = restorer
    return () => {
      disposer?.()
    }
  }, [])

  useEffect(() => {
    const divEditableNode = divEditableRef.current

    if (!divEditableNode) {
      return
    }

    const divSelectionChangeDisposer = createSelectionChangeListener(
      divEditableNode,
      () => {
        console.log(
          'contentEditable div selection change',
          document.getSelection(),
        )
      },
    )

    const {
      disposer: elementCacheSelectionDisposer,
      restorer: elementCacheSelectionRestorer,
    } = createCacheSelectionListener(divEditableNode)

    divEditableRestorerRef.current = elementCacheSelectionRestorer

    return () => {
      divSelectionChangeDisposer?.()
      elementCacheSelectionDisposer?.()
    }
  }, [])

  return (
    <div>
      <div>
        Ref div
        <div
          ref={divRef}
          style={{
            border: '1px solid gray',
          }}
        >
          <strong>hello world</strong>
        </div>
        <button
          onClick={() => {
            divRestorerRef.current?.()
          }}
        >
          reselection
        </button>
      </div>
      <div>
        Ref contentEditable div addEventListener selectionChange
        <div
          contentEditable
          ref={divEditableRef}
          style={{
            border: '1px solid gray',
          }}
        >
          <strong>hello world</strong>
        </div>
      </div>
      <div>
        React contenteditable restore selection
        <div
          contentEditable
          ref={divEditableRef}
          style={{
            border: '1px solid gray',
          }}
        >
          <strong>hello world</strong>
        </div>
        <button
          onClick={() => {
            divEditableRestorerRef.current?.()
          }}
        >
          reselection
        </button>
        <button
          onClick={() => {
            const span = document.createElement('span')
            span.textContent = 'hello'
            divEditableRef.current?.insertAdjacentElement('afterbegin', span)
          }}
        >
          add before
        </button>
      </div>
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
