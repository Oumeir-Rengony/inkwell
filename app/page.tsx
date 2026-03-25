// "use client";

// import { Authenticated, Unauthenticated } from "convex/react";
// import { SignInButton, UserButton } from "@clerk/nextjs";
// import { useQuery } from "convex/react";
// import { api } from "../convex/_generated/api";

// export default function Home() {
//   return (
//     <>
//       <Authenticated>
//         <UserButton/>
//         <Content />
//       </Authenticated>
//       <Unauthenticated>
//         <SignInButton />
//       </Unauthenticated>
//     </>
//   );
// }

// function Content() {
//   const user = useQuery(api.users.getCurrentUser);
  
//   if (!user) return <div>Loading...</div>;

//   return <div>Authenticated content: {user?.name}</div>;
// }


import Link from "next/link";
import Navbar from "@/components/ui/navbar";
import {
  PenLine,
  BookOpen,
  BarChart2,
  Globe,
  ArrowRight,
  Quote,
} from "lucide-react";

export default function Home() {
  return (
    <div style={{ backgroundColor: "#FDFAF4", minHeight: "100vh" }}>
      <Navbar />

      {/* Hero */}
      <section
        style={{
          paddingTop: "10rem",
          paddingBottom: "7rem",
          paddingLeft: "2rem",
          paddingRight: "2rem",
          maxWidth: 1200,
          margin: "0 auto",
        }}
      >
        <div className="flex items-center gap-2 mb-8" style={{ opacity: 0, animation: "fadeUp 0.6s ease 0.1s forwards" }}>
          <div style={{ width: 28, height: 1, backgroundColor: "#4A7A56" }} />
          <span style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: "#4A7A56" }}>
            A platform for writers
          </span>
        </div>

        <h1
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: "clamp(3rem, 7vw, 5.5rem)",
            fontWeight: 800,
            lineHeight: 1.05,
            letterSpacing: "-0.02em",
            color: "#0A1714",
            maxWidth: "14ch",
            marginBottom: "2rem",
            opacity: 0,
            animation: "fadeUp 0.7s ease 0.2s forwards",
          }}
        >
          Where ideas find their{" "}
          <em style={{ color: "#4A7A56" }}>voice.</em>
        </h1>

        <p
          style={{
            fontSize: "1.2rem",
            lineHeight: 1.7,
            color: "#3A524B",
            maxWidth: "52ch",
            marginBottom: "3rem",
            opacity: 0,
            animation: "fadeUp 0.7s ease 0.3s forwards",
          }}
        >
          Inkwell is a thoughtful editorial platform built for writers who believe
          the craft of writing deserves a beautiful home. Write without distraction.
          Publish with intention.
        </p>

        <div className="flex items-center gap-4 flex-wrap" style={{ opacity: 0, animation: "fadeUp 0.7s ease 0.4s forwards" }}>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 font-medium group"
            style={{
              backgroundColor: "#1E3530",
              color: "#FAF5E8",
              padding: "0.875rem 2rem",
              borderRadius: 9999,
              fontSize: "0.95rem",
              transition: "opacity 0.2s",
            }}
          >
            Start Writing
            <ArrowRight size={16} />
          </Link>
          <Link
            href="/articles"
            className="inline-flex items-center gap-2 font-medium"
            style={{
              color: "#3A524B",
              padding: "0.875rem 2rem",
              borderRadius: 9999,
              fontSize: "0.95rem",
              border: "1px solid #C8D6CB",
              transition: "border-color 0.2s",
            }}
          >
            <BookOpen size={16} />
            Browse Articles
          </Link>
        </div>
      </section>

      {/* Pull quote */}
      <section style={{ backgroundColor: "#1E3530", padding: "5rem 2rem" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
          <Quote size={32} style={{ color: "#4A7A56", margin: "0 auto 2rem" }} />
          <blockquote
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: "clamp(1.5rem, 3vw, 2.25rem)",
              fontWeight: 400,
              fontStyle: "italic",
              lineHeight: 1.5,
              color: "#FAF5E8",
              marginBottom: "1.5rem",
            }}
          >
            &ldquo;The scariest moment is always just before you start.
            After that, things can only get better.&rdquo;
          </blockquote>
          <p style={{ fontSize: "0.875rem", letterSpacing: "0.08em", textTransform: "uppercase" as const, color: "#6A9975", fontWeight: 700 }}>
            Stephen King
          </p>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: "7rem 2rem", maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ marginBottom: "4rem" }}>
          <p style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: "#4A7A56", marginBottom: "1rem" }}>
            Everything you need
          </p>
          <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 700, color: "#0A1714", lineHeight: 1.2 }}>
            Built around the writing
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "2px", backgroundColor: "#E8EDE9" }}>
          {[
            { Icon: PenLine, title: "Distraction-Free Editor", desc: "A TipTap-powered rich text editor that keeps your focus on the words. Auto-saves as you write so you never lose a thought." },
            { Icon: BarChart2, title: "Article Dashboard", desc: "Manage every piece of writing from a single, clear view. Filter by status, see your drafts, and publish with one click." },
            { Icon: Globe, title: "Instant Publishing", desc: "Publish your articles to a clean, readable public feed. SEO-friendly slug-based URLs built in from day one." },
            { Icon: BookOpen, title: "Beautiful Reading", desc: "Comfortable reading width, elegant serif typography, and an uncluttered layout that puts readers inside the text." },
          ].map(({ Icon, title, desc }) => (
            <div key={title} style={{ backgroundColor: "#FDFAF4", padding: "3rem 2.5rem", position: "relative", overflow: "hidden" }}>
              <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 48, height: 48, borderRadius: 12, backgroundColor: "#E8EDE9", marginBottom: "1.5rem" }}>
                <Icon size={22} style={{ color: "#4A7A56" }} />
              </div>
              <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "1.25rem", fontWeight: 700, color: "#0A1714", marginBottom: "0.75rem" }}>
                {title}
              </h3>
              <p style={{ fontSize: "0.95rem", lineHeight: 1.7, color: "#5C706A" }}>{desc}</p>
              <div style={{ position: "absolute", bottom: 0, right: 0, width: 120, height: 120, background: "radial-gradient(circle at 100% 100%, rgba(74, 122, 86, 0.06), transparent 70%)" }} />
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section style={{ padding: "6rem 2rem", backgroundColor: "#F5EACF", textAlign: "center" }}>
        <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 700, color: "#0A1714", marginBottom: "1.5rem" }}>
          Your story deserves a home.
        </h2>
        <p style={{ color: "#3A524B", fontSize: "1.1rem", marginBottom: "2.5rem" }}>
          Join Inkwell and start writing today. No distractions, no noise.
        </p>
        <Link
          href="/login"
          className="inline-flex items-center gap-2 font-medium"
          style={{ backgroundColor: "#1E3530", color: "#FAF5E8", padding: "0.875rem 2.5rem", borderRadius: 9999, fontSize: "0.95rem" }}
        >
          Begin Writing
          <ArrowRight size={16} />
        </Link>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid #E8EDE9", padding: "2.5rem 2rem", backgroundColor: "#FDFAF4" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div className="flex items-center gap-2">
            <PenLine size={16} style={{ color: "#4A7A56" }} />
            <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 700, color: "#0A1714" }}>Inkwell</span>
          </div>
          <p style={{ fontSize: "0.85rem", color: "#9AABA3" }}>A platform for writers who care.</p>
        </div>
      </footer>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
