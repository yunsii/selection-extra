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
  const divEditable1Ref = useRef<HTMLDivElement>(null)
  const divEditable2Ref = useRef<HTMLDivElement>(null)
  const divEditableRestorer2Ref = useRef<() => void>()

  useEffect(() => {
    const divEditable1Node = divEditable1Ref.current

    if (!divEditable1Node) {
      return
    }

    const divSelection1ChangeDisposer = createSelectionChangeListener(
      divEditable1Node,
      () => {
        console.log(
          'contentEditable div selection change',
          document.getSelection(),
        )
      },
    )

    return () => {
      divSelection1ChangeDisposer?.()
    }
  }, [])

  useEffect(() => {
    const divEditable2Node = divEditable2Ref.current

    if (!divEditable2Node) {
      return
    }

    console.log(
      '🚀 ~ file: demo2.tsx:39 ~ useEffect ~ divEditableNode:',
      divEditable2Node,
    )
    const divSelectionChangeDisposer = createSelectionChangeListener(
      divEditable2Node,
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
    } = createCacheSelectionListener(divEditable2Node)

    divEditableRestorer2Ref.current = elementCacheSelectionRestorer

    return () => {
      divSelectionChangeDisposer?.()
      elementCacheSelectionDisposer?.()
    }
  }, [])

  return (
    <div>
      <div>
        Ref contentEditable div addEventListener selectionChange
        <div
          contentEditable
          ref={divEditable1Ref}
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
          ref={divEditable2Ref}
          style={{
            border: '1px solid gray',
          }}
        >
          <strong>hello world</strong>
        </div>
        <button
          onClick={() => {
            divEditableRestorer2Ref.current?.()
          }}
        >
          reselection
        </button>
        <button
          onClick={() => {
            const span = document.createElement('span')
            span.textContent = 'hello'
            divEditable2Ref.current?.insertAdjacentElement('afterbegin', span)
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
