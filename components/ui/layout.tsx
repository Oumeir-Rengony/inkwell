import Navbar from "@/components/ui/navbar";
import { PenLine } from "lucide-react";

export default function Layout({
   children
}: {
   children: React.ReactNode
}){
   return (
      <div className="bg-[#FDFAF4] min-h-screen">
      <Navbar />

      <div className="max-w-275 mx-auto py-20 px-5">
        { children }
      </div>
      
      {/* Footer */}
      {/* <footer style={{ borderTop: "1px solid #E8EDE9", padding: "0.5rem 2rem", backgroundColor: "#FDFAF4" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div className="flex items-center gap-2">
            <PenLine size={16} style={{ color: "#4A7A56" }} />
            <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 700, color: "#0A1714" }}>Inkwell</span>
          </div>
          <p style={{ fontSize: "0.85rem", color: "#9AABA3" }}>A platform for writers who care.</p>
        </div>
      </footer> */}
    </div>
   )
}