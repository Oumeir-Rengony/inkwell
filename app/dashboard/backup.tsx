"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PenLine, Globe, EyeOff, Trash2, Edit3, FileText, Plus } from "lucide-react";
import { api } from "@/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import Navbar from "@/components/ui/navbar";
import { cn } from "@/lib/utilities";

type Filter = "all" | "draft" | "published";

const tabs = ["all", "draft", "published"];

export default function DashboardPage() {

  const articles = useQuery(api.articles.getAllArticles);

  const [filter, setFilter] = useState<Filter>("all");
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const router = useRouter();

  const createArticle = useMutation(api.articles.createArticle);



  async function handlePublishToggle() {

  }

  async function handleDelete() {

  }

  async function handleCreate(e: React.MouseEvent) {
    e.preventDefault();

    const articleId = await createArticle({
      title: "Untitled Article",
    });

    router.push(`/editor/${articleId}`);
  }

  const filtered = articles 
    ? articles.filter((a) => filter === "all" ? true : a.status === filter)
    : [];

  const counts = {
    all: articles?.length,
    draft: articles?.filter((a) => a.status === "draft").length || [],
    published: articles?.filter((a) => a.status === "published").length || [],
  };

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  }


  return (
    <div className="bg-[#FDFAF4] min-h-screen">
      <Navbar />
      <div className="max-w-275 mx-auto pt-20 pb-16 px-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-10 gap-4 flex-wrap">
          <div>
            <h1 className="font-playfair text-2xl sm:text-3xl font-extrabold text-[#0A1714] mb-1">
              Your Articles
            </h1>
            <p className="text-[#5C706A] text-sm">
              {counts.all} article{counts.all !== 1 ? "s" : ""} total
            </p>
          </div>

          <Link
            href="#"
            onClick={handleCreate}
            className="inline-flex items-center gap-2 bg-[#1E3530] text-[#FAF5E8] px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap"
          >
            <Plus size={15} /> New Article
          </Link>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-0 mb-6 border-b border-[#E8EDE9]">
          {(tabs as Filter[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn("px-4 py-2 text-sm transition-all capitalize cursor-pointer",
                (filter === f
                  ? "font-semibold text-[#1E3530] border-b-2 border-[#1E3530]"
                  : "font-normal text-[#5C706A] border-b-2 border-transparent")
              )}
            >
              {f} <span className="text-[0.75rem] text-[#9AABA3] font-normal">{counts[f]}</span>
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center p-16 text-[#9AABA3] italic">Loading articles…</div>
        ) : filtered.length === 0 ? (
          <div className="text-center p-16 sm:p-8 border-dashed rounded-lg border-[#C8D6CB]">
            <FileText size={36} className="text-[#C8D6CB] mx-auto mb-4"  />
            <h3 className="font-playfair text-xl font-semibold text-[#0A1714] mb-2">
              {filter === "all" ? "No articles yet" : `No ${filter} articles`}
            </h3>
            <p className="text-[#9AABA3] mb-4 text-sm">
              {filter === "all" ? "Your writing space is ready. Start your first article." : "Switch the filter to see articles in other states."}
            </p>
            {filter === "all" && (
              <Link href="/editor/new" className="inline-flex items-center gap-2 bg-[#1E3530] text-[#FAF5E8] px-4 py-2 rounded-full text-sm font-semibold">
                <PenLine size={14} /> Write your first article
              </Link>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-0 bg-[#E8EDE9] rounded-lg overflow-hidden">
            {filtered && filtered.map((article) => (
              <ArticleRow
                key={article._id}
                article={article}
                actionLoading={actionLoading === article._id}
                onEdit={() => router.push(`/editor/${article._id}`)}
                onPublishToggle={() => handlePublishToggle()}
                onDelete={() => handleDelete()}
                formatDate={formatDate}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ArticleRow({
  article, actionLoading, onEdit, onPublishToggle, onDelete, formatDate,
}: {
  article: any;
  actionLoading: boolean;
  onEdit: () => void;
  onPublishToggle: () => void;
  onDelete: () => void;
  formatDate: (d: string) => string;
}) {
  const isPublished = article.status === "published";

  return (
    <div className={cn("bg-[#FDFAF4] p-4 transition-opacity", actionLoading ? "opacity-50" : "opacity-100")}>
      {/* Top row: status dot + title + actions */}
      <div className="flex items-center gap-2">
        {/* Status dot */}
        <div className={cn("w-1.75 h-1.75 rounded-full shrink-0",  isPublished ? "bg-[#4A7A56]" : "bg-[#C4884A]")} />

        {/* Title — takes all remaining space */}
        <p className={cn("font-playfair text-base font-semibold flex-1 min-w-0 truncate", article.title ? "#0A1714" : "#9AABA3" )}>
          {article.title || "Untitled"}
        </p>

        {/* Actions — always visible, right-aligned */}
        <div className="flex gap-1 shrink-0" style={{ display: "flex", gap: 6, flexShrink: 0 }}>
          <ActionButton onClick={onEdit} title="Edit"><Edit3 size={13} /></ActionButton>
          <ActionButton onClick={onPublishToggle} title={isPublished ? "Unpublish" : "Publish"}>
            {isPublished ? <EyeOff size={13} /> : <Globe size={13} />}
          </ActionButton>
          <ActionButton onClick={onDelete} title="Delete" danger><Trash2 size={13} /></ActionButton>
        </div>
      </div>

      {/* Bottom row: badge + meta */}
      <div className="flex items-center gap-2 mt-2 pl-4 flex-wrap">
        <span className={cn("text-[0.7rem] px-2 py-[0.15rem] rounded-full font-bold tracking-wide shrink-0", isPublished ? "bg-[#E8EDE9] text-[#336040]" : "bg-[#F5EACF] text-[#92672A]")}>
          {isPublished ? "Published" : "Draft"}
        </span>
        <span className="text-[0.78rem] text-[#9AABA3]">
          Updated {formatDate(article.updatedAt)}
        </span>
        {article.tags && (
          <span className="text-[0.78rem] text-[#9AABA3] max-w-40 truncate">
            {article.tags.split(",").slice(0, 2).map((t: string) => t.trim()).filter(Boolean).join(", ")}
          </span>
        )}
      </div>
    </div>
  );
}

function ActionButton({ children, onClick, title, danger = false }: {
  children: React.ReactNode;
  onClick: () => void;
  title: string;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={(danger ? "text-red-600" : "text-[#3A524B]") + " inline-flex items-center justify-center w-8 h-8 rounded-md border bg-white shrink-0"}
    >
      {children}
    </button>
  );
}