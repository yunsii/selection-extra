/**
 * @title input
 * @description caret with input
 */

/* eslint-disable no-console */

import React, { useEffect, useRef, useState } from 'react'
import {
  createInputSelectionChangeListener,
  restoreInputSelection,
  saveInputSelection,
} from 'selection-extra'

export default function Demo() {
  const [input, setInput] = useState('hello world')
  const inputSelectionChangeRef = useRef<HTMLInputElement>(null)
  const textareaSelectionChangeRef = useRef<HTMLTextAreaElement>(null)
  const inputOnBlurRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const inputNode = inputSelectionChangeRef.current
    const textareaNode = textareaSelectionChangeRef.current

    if (!inputNode || !textareaNode) {
      return
    }

    const inputDisposer = createInputSelectionChangeListener(inputNode, () => {
      console.log('input selection change', document.getSelection())
    })
    const textareaDisposer = createInputSelectionChangeListener(
      textareaNode,
      () => {
        console.log('textarea selection change', document.getSelection())
      },
    )

    return () => {
      inputDisposer?.()
      textareaDisposer?.()
    }
  }, [])

  return (
    <div>
      <div>
        React input onSelect
        <input
          value={input}
          onChange={(event) => {
            setInput(event.target.value)
          }}
          // ref: https://github.com/facebook/react/issues/14335#issuecomment-442221441
          onSelect={(event) => {
            console.log('selectionStart', event.currentTarget.selectionStart)
            console.log('selectionEnd', event.currentTarget.selectionEnd)
          }}
        />
      </div>
      <div>
        Ref input addEventListener selectionChange
        <input
          value={input}
          onChange={(event) => {
            setInput(event.target.value)
          }}
          ref={inputSelectionChangeRef}
        />
      </div>
      <div>
        Ref textarea addEventListener select
        <textarea
          value={input}
          onChange={(event) => {
            setInput(event.target.value)
          }}
          ref={textareaSelectionChangeRef}
        />
      </div>
      <div>
        React input restore selection
        <input
          value={input}
          onChange={(event) => {
            setInput(event.target.value)
          }}
          onBlur={(event) => {
            saveInputSelection(event.target)
          }}
          ref={inputOnBlurRef}
        />
        <button
          onClick={() => {
            restoreInputSelection(inputOnBlurRef.current)
          }}
        >
          refocus
        </button>
      </div>
      <button
        onClick={() => {
          console.log(window.getSelection())
          console.log(document.activeElement)
        }}
      >
        caret
      </button>
    </div>
  )
}
