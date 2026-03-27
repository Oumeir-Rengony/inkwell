"use client"

import { startTransition, use, useEffect, useRef, useState } from "react";
import Navbar from "@/components/ui/navbar";
import { cn } from "@/lib/utilities";
import { Authenticated, useMutation, useQuery } from "convex/react";
import { ArrowLeft, Settings } from "lucide-react";
import dynamic from "next/dynamic";
import { notFound } from "next/navigation";
import NextLink from "next/link";
import MetadataInput from "@/components/ui/metadata-input";
import { useTiptapSync } from "@convex-dev/prosemirror-sync/tiptap";
import { api } from "@/convex/_generated/api";

// --- Tiptap Core Extensions ---
import { StarterKit } from "@tiptap/starter-kit"
import { Image } from "@tiptap/extension-image"
import { TaskItem, TaskList } from "@tiptap/extension-list"
import { TextAlign } from "@tiptap/extension-text-align"
import { Typography } from "@tiptap/extension-typography"
import { Highlight } from "@tiptap/extension-highlight"
import { Subscript } from "@tiptap/extension-subscript"
import { Superscript } from "@tiptap/extension-superscript"
import { Selection } from "@tiptap/extensions"
import { HorizontalRule } from "@/components/tiptap-node/horizontal-rule-node/horizontal-rule-node-extension"
import { ImageUploadNode } from "@/components/tiptap-node/image-upload-node/image-upload-node-extension"
import { handleImageUpload, MAX_FILE_SIZE } from "@/lib/tiptap-utils"

import { useEditor } from "@tiptap/react";
import { Doc, Id } from "@/convex/_generated/dataModel";
import AutoSaveInput from "@/components/ui/autosave-input";


const INITIAL_ARTICLE = {
  title: "",
  content: "",
  slug: "",
  tags: [],
  description: "",
  coverImage: ""
}

const SimpleEditor = dynamic(
  () => import("@/components/tiptap-templates/simple/simple-editor").then((mod) => mod.SimpleEditor),
  { ssr: false }
);

export default function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {

  const { id } = use(params);
  const article = useQuery(api.articles.getArticleById, { id: id as Id<"articles"> });

  if (!id) {
    notFound();
  }


  return (
    <Authenticated>
      <Layout id={id as Id<"articles">} article={article} />
    </Authenticated>
  )
}


export function Layout({
  id,
  article
}: {
  id: Id<"articles">,
  article: Doc<"articles"> | null | undefined;
}) {
  
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const sync = useTiptapSync(api.prosemirror, id);
  const updateArticle = useMutation(api.articles.updateContent);
  const togglePublish = useMutation(api.articles.togglePublish);


  const editor = useEditor({
    immediatelyRender: false,
    editorProps: {
      attributes: {
        autocomplete: "off",
        autocorrect: "off",
        autocapitalize: "off",
        "aria-label": "Main content area, start typing to enter text.",
        class: "simple-editor",
      },
    },
    extensions: [
      StarterKit.configure({
        horizontalRule: false,
        link: {
          openOnClick: false,
          enableClickSelection: true,
        },
      }),
      ...(sync.extension ? [sync.extension] : []),
      HorizontalRule,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      TaskList,
      TaskItem.configure({ nested: true }),
      Highlight.configure({ multicolor: true }),
      Image,
      Typography,
      Superscript,
      Subscript,
      Selection,
      // ImageUploadNode.configure({
      //   accept: "image/*",
      //   maxSize: MAX_FILE_SIZE,
      //   limit: 3,
      //   upload: handleImageUpload,
      //   onError: (error) => console.error("Upload failed:", error),
      // }),
    ],
    content: sync.initialContent || undefined
  }, [sync.initialContent, sync.extension])

  async function handleTogglePublish() {
    try {
      await togglePublish({ 
        articleId: id,
        content: editor?.getHTML() || ""
      });
    } catch (err) {
      console.error(err);
    }
  }

  function handleDelete() {

  }

  function onTitleChange(value:string) {
    startTransition(async () => {
      await updateArticle({
        articleId: id,
        title: value,
      });
    });
  }


  async function handleMetadataChange(field: string, value: any) {
    startTransition(async () => {
      await updateArticle({
        articleId: id as Id<"articles">,
        [field]: value
      });
    })
  }

  if (sync.isLoading) {
    return <p>Loading...</p>
  }

  return (

    <div>

      {/* Top bar: back link + save status + mobile sidebar toggle */}
      <div className="flex items-center justify-between mb-6">
        <NextLink href="/dashboard" className="inline-flex items-center gap-2 text-[#9AABA3] text-sm no-underline">
          <ArrowLeft size={14} /> Dashboard
        </NextLink>

        <div className="flex items-center gap-12">
          {/* Mobile sidebar toggle */}
          {/* <button
                onClick={() => setSidebarOpen((o) => !o)}
                className="inline-flex md:hidden items-center gap-6 text-sm font-semibold text-[#3A524B] bg-[#E8EDE9] border-0 border-r-8 py-2 px-3 cursor-pointer">
                <Settings size={14} />
                {sidebarOpen ? "Hide" : "Settings"}
              </button> */}
        </div>
      </div>

      <AutoSaveInput
        defaultValue={article?.title ?? ""}
        onChange={onTitleChange}
        placeholder="Article title…"
        className="w-full border-0 outline-0 bg-transparent font-playfair text-[40px] font-bold text-[#0A1714] leading-tight mb-6 caret-[#4A7A56]"
      />

      {/* Two-column layout on desktop, stacked on mobile */}
      <div className="flex flex-col md:flex-row gap-0 md:gap-12 items-start">

        {/* Editor column */}
        <div className="flex-1 min-w-0">
          <SimpleEditor editor={editor} />
        </div>


        {/* Sidebar — always visible on desktop, toggled on mobile */}
        <div className={cn("w-full hidden md:block sticky top-20 max-h-0 md:w-65 shrink-0 md:max-h-[calc(100vh-100px)] overflow-y-auto")
        }>
          <MetadataInput
            article={article}
            handleMetadataChange={handleMetadataChange}
            // onPublish={handleTogglePublish}
            // onUnpublish={handleTogglePublish}
            handleTogglePublish={handleTogglePublish}
            onDelete={handleDelete}
            saveStatus="idle"
          />
        </div>

      </div>
    </div>
    
  )
}