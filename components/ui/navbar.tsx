"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { PenLine, BookOpen, LayoutDashboard, LogOut, LogIn, Menu, X, Settings } from "lucide-react";
import { useConvexAuth } from "convex/react";
import { useClerk } from "@clerk/nextjs";

export default function Navbar({
   
}: {
}) {
   const [menuOpen, setMenuOpen] = useState(false);
   const router = useRouter();
   const pathname = usePathname();

   const { isAuthenticated, isLoading } = useConvexAuth();
   const { signOut } = useClerk();


   console.log('navbar render - isAuthenticated:', isAuthenticated, 'isLoading:', isLoading);
   

   useEffect(() => {
      setMenuOpen(false);
   }, [pathname]);

   async function handleLogout() {
      signOut({
         redirectUrl: "/"
      });
   }

   return (
      <header className="bg-[#FDFAF4] fixed top-0 left-0 right-0 z-50">
         <div className="max-w-7xl my-0 mx-auto px-4 md:px-10">
            <div className="flex items-center justify-between h-15">
               <Link className="flex items-center gap-2 no-underline" href="/">
                  <PenLine size={18} style={{ color: "#4A7A56" }} />
                  <span className="text-xl font-bold font-playfair text-[#0A1714] tracking-[-0.01em]">
                     Inkwell
                  </span>
               </Link>



               <nav className="hidden sm:flex sm:items-center sm:gap-5">

                  <Link href="/articles" className="flex items-center gap-1.5 text-sm text-[#3A524B] no-underline">
                     <BookOpen size={14} /> Articles
                  </Link>

                  {
                     (!isLoading && isAuthenticated) &&

                     <Link href="/dashboard" className="flex items-center gap-1.5 text-sm text-[#3A524B] no-underline">
                        <LayoutDashboard size={14} /> Dashboard
                     </Link>
                  }

                  {
                     (!isLoading && isAuthenticated) &&
                     <button onClick={handleLogout} className="flex items-center gap-1.5 text-sm text-[#3A524B] no-underline cursor-pointer">
                        <LogOut size={15} /> Sign Out
                     </button>
                  }
                        
               </nav>

 
               <button
                  onClick={() => setMenuOpen((o) => !o)}
                  aria-label="Toggle menu"
                  className="flex sm:hidden bg-[none] border-0 cursor-pointer text-[#1E3530] p-2 "
               >
                  {menuOpen ? <X size={22} /> : <Menu size={22} />}
               </button>
               

            </div>
         </div>

         {/* Mobile drawer */}
         {menuOpen && (
            <div className="max-w-7xl my-0 mx-auto px-10 py-4 md:hidden bg-white border-t border-[#E8EDE9] " style={{ boxShadow: '0 2px 4px 0 rgba(0,0,0,.1)'}}>
               <div className="flex flex-col">

                   <MobileLink href="/articles">
                     <BookOpen size={16} /> articles
                  </MobileLink>

                  {(!isLoading && isAuthenticated) &&
                     <>
                        <MobileLink href="/dashboard">
                           <LayoutDashboard size={16} /> Dashboard
                        </MobileLink>

                        <MobileLink href="/editor/new">
                           <PenLine size={16} /> New Article
                        </MobileLink>

                        <button
                           onClick={handleLogout}
                           className="flex items-center gap-3 text-[#9AABA3] bg-[none] border-0 mt-1 pt-4 cursor-pointer"
                        >
                           <LogOut size={16} /> Sign Out
                        </button>
                     </>
                  }

               </div>
            </div>
         )}

      </header>
   );
}

function MobileLink({ href, children, onClick }: { href: string; children: React.ReactNode; onClick?: () => void }) {
   return (
      <Link href={href} onClick={onClick} style={{ display: "flex", alignItems: "center", gap: 12, padding: "0.875rem 0", fontSize: "1rem", color: "#1E3530", textDecoration: "none", borderBottom: "1px solid #F0F0EC" }}>
         {children}
      </Link>
   );
}