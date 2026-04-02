import { auth, currentUser } from "@clerk/nextjs/server";
import { fetchMutation } from "convex/nextjs";
import { redirect } from "next/navigation";
import { api } from "@/convex/_generated/api";

export default async function CallbackPage() {

   const { userId } = await auth();

   if (!userId) {
      redirect("/");
   }

   const user = await currentUser();

   if (!user) {
      redirect("/");
   }

   try {
      const convexUserId = await fetchMutation(api.users.upsertUser, {
         clerkId: user.id,
         email: user.emailAddresses[0]?.emailAddress ?? "",
         name: `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() || undefined,
         avatarUrl: user.imageUrl || undefined,
      });
         console.log(convexUserId)

   }catch(e){
      console.error("Error upserting user in Convex:", e);
      redirect("/");
   }

   redirect("/dashboard");
}