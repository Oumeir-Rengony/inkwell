import { mutation, query, type QueryCtx, type MutationCtx } from "./_generated/server";
import { v } from "convex/values";
import slugify from "slugify";
import { prosemirrorSync } from "./prosemirror";
import { components } from "./_generated/api";
import { Id } from "@/convex/_generated/dataModel";

/**
 * Get the current user or throw. Used in mutations that require auth.
 */
async function requireUser(ctx: QueryCtx) {
   const identity = await ctx.auth.getUserIdentity();
   if (!identity) throw new Error("Not authenticated");

   const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q: any) => q.eq("clerkId", identity.subject))
      .unique();

   if (!user) throw new Error("User not found.");
   return user;
}


export const createDraftArticle = mutation({
   handler: async (ctx: MutationCtx) => {
      const user = await requireUser(ctx);

      if (!user) {
         return
      }

      const articleId = await ctx.db.insert("articles", {
         title: "",
         slug: "",
         authorId: user._id,
         content: "",
         status: "draft",
         updatedAt: Date.now(),
      });

      await prosemirrorSync.create(ctx, articleId, { type: "doc", content: [] });


      return articleId;
   },
});

export const remove = mutation({
   args: {
      articleId: v.id("articles"),
   },
   handler: async (ctx: MutationCtx, { articleId }) => {
      const user = await requireUser(ctx);

      if (!user) throw new Error("UnAuthorized");

      const article = await ctx.db.get(articleId);
      if (!article) throw new Error("Article not found");

      // Delete prosemirror snapshots and steps
      await ctx.runMutation(components.prosemirrorSync.lib.deleteDocument, {
         id: articleId,
      });

      await ctx.db.delete(articleId);

   }


});

export const updateContent = mutation({
   args: {
      articleId: v.id("articles"),
      title: v.string(),
      slug: v.string(),
      content: v.string(),
   },
   handler: async (ctx: MutationCtx, args) => {

      const user = await requireUser(ctx);

      if (!user) throw new Error("UnAuthorized");

      await ctx.db.patch(args.articleId, {
         content: args.content,
         title: args.title,
         slug: args.slug,
         updatedAt: Date.now(),
      });
   },
});

export const togglePublish = mutation({
  args: {
   articleId: v.id("articles"),
  },
  handler: async (ctx: MutationCtx, { articleId }) => {

    const user = await requireUser(ctx);
    const article = await ctx.db.get(articleId);

    if (!article) throw new Error("Article not found");

    if (!user) {
      throw new Error("Unauthorized");
    }

    const isPublished = article.status === "published";

    await ctx.db.patch(articleId, {
      status: isPublished ? "draft" : "published",
      publishedAt: isPublished ? undefined : Date.now(),
      updatedAt: Date.now(),
    });
  },
});

export const getBySlug = query({
   args: { slug: v.string() },

   handler: async (ctx: QueryCtx, { slug }) => {

      const article = await ctx.db
         .query("articles")
         .withIndex("by_slug", q => q.eq("slug", slug))
         .unique();

      if (!article || article.status !== "published") return null;

      return article;
   },
});

export const getArticleById = query({
   args: { id: v.id("articles") },

   handler: async (ctx: QueryCtx, { id }) => {

      const article = await ctx.db.get(id);
      console.log(article, id)

      if (!article) return null;

      return article;
   },
});

export const getAllArticles = query({
   handler: async (ctx) => {
      return await ctx.db.query("articles").collect();
   },
});