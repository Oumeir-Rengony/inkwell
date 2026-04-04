// convex/prosemirror.ts
import { ProsemirrorSync } from "@convex-dev/prosemirror-sync";
import { components } from "./_generated/api";
import { Id } from "./_generated/dataModel";

export const prosemirrorSync = new ProsemirrorSync<Id<"articles">>(
  components.prosemirrorSync
);

export const {
  getSnapshot,
  submitSnapshot,
  latestVersion,
  getSteps,
  submitSteps,
} = prosemirrorSync.syncApi({
  async checkRead(ctx) {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");
  },

  async checkWrite(ctx, id) {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");


    const userPromise = ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .unique();
    
    const articlePromise = ctx.db.get(id);

    const [user, article] = await Promise.all([userPromise, articlePromise])


    if (!article) throw new Error("Article not found");

    if (!user) throw new Error("Not authorized to edit this article");
    
  },

  async onSnapshot(ctx, id, snapshot, version) {

    await ctx.runMutation(
      components.prosemirrorSync.lib.deleteSteps,{
        id: id,
        beforeTs: Date.now(),
      }
    );
    
  },

  pruneSnapshots: true
});
