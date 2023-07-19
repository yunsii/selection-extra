/**
 * @title non-contenteditable
 * @description selection with non-contenteditable
 */

/* eslint-disable no-console */

import React, { useEffect, useRef } from 'react'
import {
  createCacheSelectionListener,
  createSelectionChangeListener,
} from 'selection-extra'

export default function Demo() {
  const divNonEditable1Ref = useRef<HTMLDivElement>(null)
  const divNonEditable2Ref = useRef<HTMLDivElement>(null)
  const divNonEditable2RestorerRef = useRef<() => void>()

  useEffect(() => {
    const divNonEditable1Node = divNonEditable1Ref.current

    if (!divNonEditable1Node) {
      return
    }

    const disposer = createSelectionChangeListener(divNonEditable1Node, () => {
      console.log(
        'non-contenteditable div selection change',
        document.getSelection(),
      )
    })

    return () => {
      disposer?.()
    }
  }, [])

  useEffect(() => {
    const divNonEditable2Node = divNonEditable2Ref.current

    if (!divNonEditable2Node) {
      return
    }

    const divSelectionChangeDisposer = createSelectionChangeListener(
      divNonEditable2Node,
      () => {
        console.log(
          'non-contenteditable div selection change',
          document.getSelection(),
        )
      },
    )

    const {
      disposer: elementCacheSelectionDisposer,
      restorer: elementCacheSelectionRestorer,
    } = createCacheSelectionListener(divNonEditable2Node)

    divNonEditable2RestorerRef.current = elementCacheSelectionRestorer

    return () => {
      divSelectionChangeDisposer?.()
      elementCacheSelectionDisposer?.()
    }
  }, [])

  return (
    <div>
      <div>
        Ref non-contenteditable div addEventListener selectionChange
        <div
          ref={divNonEditable1Ref}
          style={{
            border: '1px solid gray',
          }}
        >
          <strong>hello world 111</strong>
        </div>
      </div>
      <div>
        React non-contenteditable restore selection
        <div
          ref={divNonEditable2Ref}
          style={{
            border: '1px solid gray',
          }}
        >
          <strong>hello world 222</strong>
        </div>
        <button
          onClick={() => {
            divNonEditable2RestorerRef.current?.()
          }}
        >
          reselection
        </button>
        <button
          onClick={() => {
            const span = document.createElement('span')
            span.textContent = 'hello'
            divNonEditable2Ref.current?.insertAdjacentElement(
              'afterbegin',
              span,
            )
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
