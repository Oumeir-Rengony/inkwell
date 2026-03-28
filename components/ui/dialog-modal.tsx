import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/shadcn-ui/alert-dialog";
import { Loader, Loader2, Loader2Icon } from "lucide-react";
import { useTransition } from "react";

export default function DialogModal({
   title,
   description,
   label,
   variants,
   onAcceptAction,
   onCloseAction
}: {
   title: string;
   description?: string;
   label?: {
      yes?: string;
      no?: string
   };
   variants?: {
      yes?: "link" | "default" | "outline" | "secondary" | "ghost" | "destructive" | null;
      no?: "link" | "default" | "outline" | "secondary" | "ghost" | "destructive" | null;
   }
   onAcceptAction?: () => Promise<void>;
   onCloseAction?: () => void;
}){

   const [isPending, startTransition] = useTransition();

   return(
      <AlertDialogContent size="sm">
         <AlertDialogHeader>
            <AlertDialogTitle>{title}</AlertDialogTitle>
            <AlertDialogDescription>
               { description }
            </AlertDialogDescription>
         </AlertDialogHeader>
         <AlertDialogFooter>
            <AlertDialogCancel
               variant={variants?.no || "default"}
               size="lg"
               onClick={onCloseAction}
               className="cursor-pointer"
            >
                  {label?.no || "Cancel"}
            </AlertDialogCancel>
            <AlertDialogAction 
               variant={variants?.yes || "default"}
               size="lg"
               className="cursor-pointer"
               onClick={(e) => {
                  e.preventDefault(); 
                  startTransition(async () => {
                     await onAcceptAction?.();
                     onCloseAction?.()
                  });
               }}
            >
               { label?.yes || "Continue" }
               { isPending && <Loader2 className="animate-spin"/> }
            </AlertDialogAction>
         </AlertDialogFooter>
      </AlertDialogContent>
   )
}