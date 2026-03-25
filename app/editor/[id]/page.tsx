"use client"

import { startTransition, use, useState } from "react";
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
import useDebouncedCallback from "@/hooks/use-debounced-callback";


const INITIAL_ARTICLE = {
  title: "",
  content: "",
  slug: "",
  tags: [],
  excerpt: "",
  coverImage: "",
  seoDescription: "",
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

  console.log(article)

  if (!id) {
    notFound();
  }


  return (
    <Authenticated>
      <Layout id={id} article={article} />
    </Authenticated>
  )
}


export function Layout({
  id,
  article
}: {
  id: string,
  article: Doc<"articles"> | null | undefined;
}) {

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const sync = useTiptapSync(api.prosemirror, id);
  const updateArticle = useMutation(api.articles.updateContent);


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


  const debouncedUpdate = useDebouncedCallback((value: string) => {
    if (!article) return;

    startTransition(() => {
      updateArticle({
        ...INITIAL_ARTICLE,
        articleId: id as Id<"articles">,
        title: value,
      });
    });
  },
    600,
    [article, id],
    { leading: false, trailing: true }
  );

  function handleTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    debouncedUpdate(value);
  }


  // function handleTitleChange(e: React.ChangeEvent<HTMLInputElement>) {

  //   if (!article) return;

  //   startTransition(async() => {
  //     await updateArticle({
  //       ...INITIAL_ARTICLE,
  //       articleId: id as Id<"articles">,
  //       title: e.target.value
  //     })
  //   })

  // }

  function handlePublish() {

  }

  function handleUnpublish() {

  }

  function handleDelete() {

  }


  async function handleMetadataChange(field: string, value: string) {
    await updateArticle({
      articleId: id as Id<"articles">,
      ...INITIAL_ARTICLE,
      [field]: value
    });
  }

  if (sync.isLoading) {
    return <p>Loading...</p>
  }

  return (
    <div className="bg-[#FDFAF4] min-h-screen">
      <div className="max-w-7xl mx-auto">
        <Navbar />

        <div className="my-0 py-18 px-10">

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

          {/* Title */}
          <input
            type="text"
            value={article?.title}
            onChange={handleTitleChange}
            placeholder="Article title…"
            className="w-full border-0 outline-0 bg-transparent font-playfair text-[clamp(1.5rem, 5vw, 2.5rem)] text-4xl font-bold text-[#0A1714] leading-tight mb-6 caret-[#4A7A56]"
          />


          {/* Two-column layout on desktop, stacked on mobile */}
          <div className="flex flex-col md:flex-row gap-0 md:gap-12 items-start">

            {/* Editor column */}
            <div className="flex-1 min-w-0">
              <SimpleEditor editor={editor} />
            </div>


            {/* Sidebar — always visible on desktop, toggled on mobile */}
            <div className={cn("w-full hidden md:block static max-h-0 md:w-65 shrink-0 top-20 md:max-h-[calc(100vh-100px)] overflow-y-auto",
              // sidebarOpen ? "block" : ""
            )
            }>
              <MetadataInput
                article={article}
                onChange={handleMetadataChange}
                onPublish={handlePublish}
                onUnpublish={handleUnpublish}
                onDelete={handleDelete}
                saveStatus="idle"
              />
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}