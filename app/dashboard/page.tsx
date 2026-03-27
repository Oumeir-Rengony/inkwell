"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  PenLine,
  Globe,
  Trash2,
  Edit3,
  FileText,
  Plus,
  GlobeOff,
} from "lucide-react";
import { api } from "@/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import Navbar from "@/components/ui/navbar";
import { cn } from "@/lib/utilities";
import { Id } from "@/convex/_generated/dataModel";

type Filter = "all" | "draft" | "published";

const tabs: Filter[] = ["all", "draft", "published"];

export default function DashboardPage() {
  const articles = useQuery(api.articles.getAllArticles);
  const [filter, setFilter] = useState<Filter>("all");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const router = useRouter();

  const createDraftArticle = useMutation(api.articles.createDraftArticle);
  const deleteArticle = useMutation(api.articles.remove);
  const togglePublish = useMutation(api.articles.togglePublish);

  async function handlePublishToggle(articleId: Id<"articles">, content: string) {
    try {
      setActionLoading(articleId);
      await togglePublish({
        articleId,
        content
      });

    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  }

  async function handleDelete(articleId: Id<"articles">) {
    try {
      setActionLoading(articleId);

      await deleteArticle({ articleId });

    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  }


  async function handleCreate(e: React.MouseEvent) {
    e.preventDefault();

    const articleId = await createDraftArticle();

    console.log(articleId);

    router.push(`/editor/${articleId}`);
  }

  const filtered = articles?.filter((a) => {
    if (filter === "all") return true;
    return a.status === filter;
  }) ?? [];

  const counts = {
    all: articles?.length ?? 0,
    draft: articles?.filter((a) => a.status === "draft").length ?? 0,
    published: articles?.filter((a) => a.status === "published").length ?? 0,
  };

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  const isLoading = articles === undefined;

  return (
    <div>

      {/* Header */}
      <div className="flex items-start justify-between mb-10 gap-4 flex-wrap">
        <div>
          <h1 className="font-playfair text-2xl sm:text-3xl font-extrabold text-[#0A1714] mb-2">
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

      {/* Tabs */}
      <div className="flex gap-0 mb-6 border-b border-[#E8EDE9]">
        {tabs.map((f) => {
          const isActive = filter === f;

          return (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "px-4 py-2 text-sm transition-all capitalize cursor-pointer",
                isActive
                  ? "font-semibold text-[#1E3530] border-b-2 border-[#1E3530]"
                  : "font-normal text-[#5C706A] border-b-2 border-transparent"
              )}
            >
              {f}
              <span className="text-[0.75rem] text-[#9AABA3] font-normal ml-1">
                {counts[f]}
              </span>
            </button>
          );
        })}
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="text-center p-16 text-[#9AABA3] italic">
          Loading articles…
        </div>
      ) : (
        <ListArticles
          filtered={filtered}
          handlePublishToggle={handlePublishToggle}
          handleDelete={handleDelete}
          handleCreate={handleCreate}
          actionLoading={actionLoading}
          filter={filter}
          formatDate={formatDate}
        />
      )}
    </div>
  );
}

function ListArticles({
  filtered,
  handlePublishToggle,
  handleDelete,
  handleCreate,
  actionLoading,
  filter,
  formatDate
}: {
  filtered: any[];
  handlePublishToggle: (articleId: Id<"articles">, content: string) => void;
  handleDelete: (articleId: Id<"articles">) => void;
  handleCreate?: (e: React.MouseEvent) => void;
  actionLoading: string | null;
  filter: Filter;
  formatDate: (d: string) => string;
}) {

  const hasArticles = filtered.length > 0;
  const router = useRouter();

  function handleEdit(id: string) {
    router.push(`/editor/${id}`)
  }

  if (!hasArticles) {
    return (
      <EmptyArticles filter={filter} handleCreate={handleCreate} />
    );
  }

  return (
    <div className="flex flex-col gap-0 bg-[#E8EDE9] rounded-lg overflow-hidden">
      {filtered.map((article) => (
        <ArticleRow
          key={article._id}
          article={article}
          actionLoading={actionLoading === article._id}
          onEdit={() => handleEdit(article._id)}
          onPublishToggle={() => handlePublishToggle(article._id, article.content)}
          onDelete={() => handleDelete(article._id)}
          formatDate={formatDate}
        />
      ))}
    </div>
  );
}

function EmptyArticles({
  filter,
  handleCreate
}: {
  filter: Filter;
  handleCreate?: (e: React.MouseEvent) => void
}) {
  const emptyTitle = filter === "all" ? "No articles yet" : `No ${filter} articles`;

  const emptyDescription = filter === "all"
    ? "Your writing space is ready. Start your first article."
    : "Switch the filter to see articles in other states.";

  return (
    <div className="text-center p-16 sm:p-8 border-dashed rounded-lg border-[#C8D6CB]">
      <FileText size={36} className="text-[#C8D6CB] mx-auto mb-4" />

      <h3 className="font-playfair text-xl font-semibold text-[#0A1714] mb-2">
        {emptyTitle}
      </h3>

      <p className="text-[#9AABA3] mb-4 text-sm">
        {emptyDescription}
      </p>

      {filter === "all" && (
        <Link
          href="#"
          onClick={handleCreate}
          className="inline-flex items-center gap-2 bg-[#1E3530] text-[#FAF5E8] px-4 py-2 rounded-full text-sm font-semibold"
        >
          <PenLine size={14} /> Write your first article
        </Link>
      )}
    </div>
  );
}

function ArticleRow({
  article,
  actionLoading,
  onEdit,
  onPublishToggle,
  onDelete,
  formatDate,
}: {
  article: any;
  actionLoading: boolean;
  onEdit: () => void;
  onPublishToggle: () => void;
  onDelete: () => void;
  formatDate: (d: string) => string;
}) {
  const isPublished = article?.status === "published";

  const statusColor = isPublished ? "bg-[#4A7A56]" : "bg-[#C4884A]";
  const badgeStyle = isPublished
    ? "bg-[#E8EDE9] text-[#336040]"
    : "bg-[#F5EACF] text-[#92672A]";
  const badgeText = isPublished ? "Published" : "Draft";
  const titleColor = article?.title
    ? "text-[#0A1714]"
    : "text-[#9AABA3]";

  return (
    <div
      className={cn(
        "bg-[#FDFAF4] p-4 transition-opacity",
        // actionLoading ? "opacity-50" : "opacity-100"
      )}
    >
      <div className="flex items-center gap-2">
        <div
          className={cn(
            "w-1.75 h-1.75 rounded-full shrink-0",
            statusColor
          )}
        />

        <p
          className={cn(
            "font-playfair text-base font-semibold flex-1 min-w-0 truncate",
            titleColor
          )}
        >
          {article?.title || "Untitled"}
        </p>

        <div className="flex gap-1 shrink-0">
          <ActionButton
            onClick={onEdit}
            title="Edit"
            disabled={actionLoading}
          >
            <Edit3 size={13} />
          </ActionButton>

          <ActionButton
            onClick={onPublishToggle}
            title={isPublished ? "Unpublish" : "Publish"}
            disabled={actionLoading}

          >
            {isPublished ? (
              <GlobeOff size={13} />
            ) : (
              <Globe size={13} />
            )}
          </ActionButton>

          <ActionButton
            onClick={onDelete}
            title="Delete"
            danger
            disabled={actionLoading}
          >
            <Trash2 size={13} />
          </ActionButton>
        </div>
      </div>

      <div className="flex items-center gap-2 mt-2 pl-4 flex-wrap">
        <span
          className={cn(
            "text-[0.7rem] px-2 py-[0.15rem] rounded-full font-bold tracking-wide shrink-0",
            badgeStyle
          )}
        >
          {badgeText}
        </span>

        <span className="text-[0.78rem] text-[#9AABA3]">
          Updated {formatDate(article?.updatedAt)}
        </span>

        {Array.isArray(article?.tags) && article?.tags.length > 0 && (
          <span className="text-[0.78rem] text-[#9AABA3] max-w-40 truncate">
            {article?.tags.join(", ")}
          </span>
        )}
      </div>
    </div>
  );
}

function ActionButton({
  children,
  onClick,
  title,
  disabled,
  danger = false,
}: {
  children: React.ReactNode;
  onClick: () => void;
  title: string;
  disabled?: boolean;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      disabled={disabled}
      className={cn(
        "inline-flex items-center justify-center w-8 h-8 rounded-md border border-[#E8EDE9] bg-white shrink-0 cursor-pointer hover:bg-[#f6f6f6]",
        danger ? "text-red-600" : "text-[#3A524B]"
      )}
    >
      {children}
    </button>
  );
}