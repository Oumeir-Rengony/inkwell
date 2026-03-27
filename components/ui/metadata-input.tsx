"use client";

import { cn, parseCommaList } from "@/lib/utilities";
import { Globe, EyeOff, Trash2, ExternalLink } from "lucide-react";
import AutoSaveInput from "@/components/ui/autosave-input";
import AutoSaveTextarea from "@/components/ui/autosave-textarea"
import slugify from "slugify";

interface MetadataInputProps {
  article: any;
  handleMetadataChange: (field: string, value: string | string[]) => void;
  handleTogglePublish: () => Promise<void>;
  // onPublish: () => Promise<void>;
  // onUnpublish: () => void;
  onDelete: () => void;
  saveStatus: "idle" | "saving" | "saved" | "error";
}

export default function MetadataInput({
  article,
  handleMetadataChange,
  handleTogglePublish,
  // onPublish,
  // onUnpublish,
  onDelete,
}: MetadataInputProps) {
  const isPublished = article?.status === "published";


  const handleTags = (value: string) => {
    const tags = parseCommaList(value);
    handleMetadataChange("tags", tags);
  }

  return (
    <aside
      style={{
        width: '100%',
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        gap: "1.5rem",
      }}
    >
      {/* Status badge + save indicator */}
      <div className="flex items-center justify-between">

        <p className={cn("flex items-center gap-6 py-1.5 px-3 rounded-full font-bold tracking-wider uppercase",
            isPublished ? "bg-[#E8EDE9] text-[#336040]" : "bg-[#F5EACF] text-[#92672A]"
          )}
        >
          <span className={cn("block w-4 h-4 rounded-full", isPublished ? "bg-[#4A7A56]" : "bg-[#C4884a]")} />
          <span className="block">{isPublished ? "Published" : "Draft"}</span>
        </p>

      </div>

      {/* Publish controls */}
      <div className="flex flex-col gap-2.5">
        {isPublished ? (
          <>
            <a
              href={`/articles/${article.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-[#E8EDE9] text-[#1e3530] p-3 rounded-full text-sm font-semibold no-underline"
            >
              <ExternalLink size={14} />
              View Live
            </a>
            <button
              onClick={handleTogglePublish}
              className="flex items-center justify-center gap-2 bg-transparent border border-[#E8EDE9] p-3 rounded-full text-sm font-medium cursor-pointer">
              <EyeOff size={14} />
              Unpublish
            </button>
          </>
        ) : (
          <button
            onClick={handleTogglePublish}
            className="flex items-center justify-center gap-2 bg-[#1E3530] text-[#FAF5E8] p-3 font-semibold rounded-full cursor-pointer border-0"
          >
            <Globe size={14} />
            Publish Article
          </button>
        )}
      </div>

      {/* Divider */}
      <div className="h-px bg-[#E8EDE9]"/>

      {/* Metadata fields */}
      <div>
        <label className="block text-xs font-bold tracking-[0.08em] uppercase text-[#5C706A] pb-2">Description</label>
        <AutoSaveTextarea
          defaultValue={article?.description ?? ""}
          onChange={(value) => handleMetadataChange("description", value)}
          rows={4}
          placeholder="A brief description of this article…"
          className="w-full py-2.5 px-3 rounded-[8] text-sm text-[#0A1714] border border-[#e8ede9] bg-[#FDFAF4] outline-0 resize-none"
          onFocus={(e) => (e.target.style.borderColor = "#4A7A56")}
          onBlur={(e) => (e.target.style.borderColor = "#E8EDE9")}
        />
      </div>

      <div>
        <label className="block text-xs font-bold tracking-[0.08em] uppercase text-[#5C706A] pb-2">Tags</label>
        <AutoSaveInput
          defaultValue={article?.tags ?? ""}
          onChange={handleTags}
          onFocus={(e) => (e.target.style.borderColor = "#4A7A56")}
          onBlur={(e) => (e.target.style.borderColor = "#E8EDE9")}
          placeholder="ramadhaan, roza, moon"
          className="w-full py-2.5 px-3 rounded-[8] text-sm text-[#0A1714] border border-[#e8ede9] bg-[#FDFAF4] outline-0 resize-none"
        />
        <p style={{ fontSize: "0.7rem", color: "#9AABA3", marginTop: "0.35rem" }}>
          Comma-separated
        </p>
      </div>

      <div>
        <label className="block text-xs font-bold tracking-[0.08em] uppercase text-[#5C706A] pb-2">Cover Image URL</label>
        <AutoSaveInput
          type="url"
          defaultValue={article?.coverImage ?? ""}
          onChange={(value) => handleMetadataChange("coverImage", value)}
          placeholder="https://…"
          className="w-full py-2.5 px-3 rounded-lg text-sm text-[#0A1714] border border-[#e8ede9] bg-[#FDFAF4] outline-0 resize-none"
          onFocus={(e) => (e.target.style.borderColor = "#4A7A56")}
          onBlur={(e) => (e.target.style.borderColor = "#E8EDE9")}
        />
        {article?.coverImage && (
          <div className="mt-3 rounded-lg overflow-hidden h-30 bg-[#E8EDE9]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={article?.coverImage}
              alt="Cover"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="h-px bg-[#E8EDE9]" />

      {/* Slug */}
      <div>
        <label className="block text-xs font-bold tracking-[0.08em] uppercase text[#5C706A] pb-2">Slug</label>
        <p className="text-xs text-[#5C706A] font-mono bg-[#F5F5F0] py-1.5 px-2.5 rounded-md">
          /articles/{slugify(article?.slug || "", { lower: true, strict: true})}
        </p>
      </div>

      {/* Danger zone */}
      {/* <div style={{ marginTop: "auto", paddingTop: "1rem" }}>
        <button
          onClick={() => {
            if (confirm("Delete this article? This cannot be undone.")) {
              onDelete();
            }
          }}
          className="flex items-center gap-2 bg-transparent border-0 text-[#B91C1C] text-xs cursor-pointer p-0 opacity-[0.7]"
        >
          <Trash2 size={13} />
          Delete article
        </button>
      </div> */}
      
    </aside>
  );
}
