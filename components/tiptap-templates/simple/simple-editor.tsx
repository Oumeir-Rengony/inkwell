"use client"

import { EditorContent, EditorContext } from "@tiptap/react"
import { EditorToolbar } from "./toolbar";


export function SimpleEditor({
  editor
}: {
  editor: any
}) {

  return (
    <>
      <EditorContext.Provider value={{ editor }}>

        <EditorToolbar className="mb-5"/>

        <EditorContent
          editor={editor}
          role="presentation"
          className=""
        />

      </EditorContext.Provider>
    </>
  )
}
