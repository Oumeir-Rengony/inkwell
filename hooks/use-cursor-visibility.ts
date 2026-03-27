// "use client"

// import { useWindowSize } from "@/hooks/use-window-size"
// import { useBodyRect } from "@/hooks/use-element-rect"
// import { useEffect } from "react"
// import { useCurrentEditor } from "@tiptap/react"

// /**
//  * Custom hook that ensures the cursor remains visible when typing in a Tiptap editor.
//  * Automatically scrolls the window when the cursor would be hidden by the toolbar.
//  * @param options.overlayHeight Toolbar height to account for
//  */

// export function useCursorVisibility(overlayHeight:number = 0)  {

//   const { height: windowHeight } = useWindowSize();
//   const { editor } = useCurrentEditor();


//   const rect = useBodyRect({
//     enabled: true,
//     throttleMs: 100,
//     useResizeObserver: true,
//   })

//   useEffect(() => {

//     if (!editor) return
//     if (!editor.isEditable) return
//     if (!editor.isFocused) return

//     const view = editor.view;

//     // Extra safety in case TipTap isn't fully mounted yet
//     if (!view) return

//     const ensureCursorVisibility = () => {
//       // Get current cursor position coordinates
//       const { from } = editor.state.selection
//       const cursorCoords = view.coordsAtPos(from)

//       if (windowHeight < rect.height && cursorCoords) {
//         const availableSpace = windowHeight - cursorCoords.top

//         // If the cursor is hidden behind the overlay or offscreen, scroll it into view
//         if (availableSpace < overlayHeight) {
//           const targetCursorY = Math.max(windowHeight / 2, overlayHeight)
//           const currentScrollY = window.scrollY
//           const cursorAbsoluteY = cursorCoords.top + currentScrollY
//           const newScrollY = cursorAbsoluteY - targetCursorY

//           window.scrollTo({
//             top: Math.max(0, newScrollY),
//             behavior: "smooth",
//           })
//         }
//       }
//     }

//     ensureCursorVisibility()
//   }, [editor, overlayHeight, windowHeight, rect.height])

//   return rect
// }



"use client"

import { useWindowSize } from "@/hooks/use-window-size"
import { useBodyRect } from "@/hooks/use-element-rect"
import { useCurrentEditor } from "@tiptap/react"
import { useCallback, useEffect, useRef } from "react"

interface UseCursorVisibilityOptions {
  /**
   * Height of sticky/floating UI that may cover the editor.
   * Example: toolbar, top bar, composer actions.
   */
  overlayHeight?: number

  /**
   * Minimum safe space below the caret before we scroll.
   * Prevents the cursor from hugging the bottom edge.
   */
  bottomPadding?: number

  /**
   * Prevents repeated tiny scroll adjustments while typing.
   */
  scrollThreshold?: number

  /**
   * Delay between auto-scrolls to avoid scroll spam.
   */
  cooldownMs?: number

  /**
   * Use smooth scrolling or instant scrolling.
   * "auto" usually feels better while typing.
   */
  behavior?: ScrollBehavior
}

export function useCursorVisibility({
  overlayHeight = 0,
  bottomPadding = 96,
  scrollThreshold = 24,
  cooldownMs = 150,
  behavior = "auto",
}: UseCursorVisibilityOptions = {}) {
  const { editor } = useCurrentEditor()
  const { height: windowHeight } = useWindowSize()

  const rect = useBodyRect({
    enabled: true,
    throttleMs: 100,
    useResizeObserver: true,
  })

  const rafRef = useRef<number | null>(null)
  const lastScrollAtRef = useRef(0)
  const lastTargetYRef = useRef<number | null>(null)

  const cancelScheduled = () => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
  }

  const ensureCursorVisibility = useCallback(() => {
    if (!editor) return
    if (!editor.isEditable) return
    if (!editor.isFocused) return

    const view = editor.view
    if (!view) return

    const { from } = editor.state.selection
    const cursorCoords = view.coordsAtPos(from)

    if (!cursorCoords) return
    if (windowHeight <= 0) return
    if (rect.height <= windowHeight) return

    const visibleBottom = windowHeight - overlayHeight
    const safeBottom = visibleBottom - bottomPadding

    const cursorBottom = cursorCoords.bottom
    const overflow = cursorBottom - safeBottom

    // Cursor is already comfortably visible
    if (overflow <= 0) return

    const now = Date.now()
    if (now - lastScrollAtRef.current < cooldownMs) return

    const currentScrollY = window.scrollY
    const targetScrollY = Math.max(0, currentScrollY + overflow)

    // Avoid repeated tiny scrolls
    if (
      lastTargetYRef.current !== null &&
      Math.abs(targetScrollY - lastTargetYRef.current) < scrollThreshold
    ) {
      return
    }

    lastScrollAtRef.current = now
    lastTargetYRef.current = targetScrollY

    window.scrollTo({
      top: targetScrollY,
      behavior,
    })
  }, [
    editor,
    windowHeight,
    rect.height,
    overlayHeight,
    bottomPadding,
    scrollThreshold,
    cooldownMs,
    behavior,
  ])

  const scheduleEnsureCursorVisibility = useCallback(() => {
    cancelScheduled()

    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = requestAnimationFrame(() => {
        ensureCursorVisibility()
      })
    })
  }, [ensureCursorVisibility])

  useEffect(() => {
    if (!editor) return

    editor.on("selectionUpdate", scheduleEnsureCursorVisibility)
    editor.on("transaction", scheduleEnsureCursorVisibility)
    editor.on("focus", scheduleEnsureCursorVisibility)
    window.addEventListener("resize", scheduleEnsureCursorVisibility)

    return () => {
      editor.off("selectionUpdate", scheduleEnsureCursorVisibility)
      editor.off("transaction", scheduleEnsureCursorVisibility)
      editor.off("focus", scheduleEnsureCursorVisibility)
      window.removeEventListener("resize", scheduleEnsureCursorVisibility)
      cancelScheduled()
    }
  }, [editor, scheduleEnsureCursorVisibility])

  return rect
}