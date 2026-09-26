import { Suspense, lazy, useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import BackToTop from "./components/BackToTop";
import Intro from "./components/Intro";
import { useTheme } from "./hooks/useTheme";
import { SITE_URL, DEFAULT_TITLE, DEFAULT_DESCRIPTION, setCanonical, setMeta } from "./utils/seo";

import Home from "./sections/Home";
import Services from "./sections/Services";
import Work from "./sections/Work";
import Experience from "./sections/Experience";
import Education from "./sections/Education";
import About from "./sections/About";
import Contact from "./sections/Contact";

const BlogPage = lazy(() => import("./components/BlogPage"));
const WritingIndex = lazy(() => import("./components/WritingIndex"));
const NotFound = lazy(() => import("./components/NotFound"));

const SECTIONS = ["experience", "services", "work", "education", "about", "contact"];

function HomePage() {
  // Blog routes rewrite title, description, and canonical; restore them here.
  useEffect(() => {
    document.title = DEFAULT_TITLE;
    setMeta("name", "description", DEFAULT_DESCRIPTION);
    setMeta("property", "og:type", "website");
    setMeta("property", "og:url", SITE_URL + "/");
    setCanonical(SITE_URL + "/");
  }, []);

  return (
    <>
      <Home />
      <Experience />
      <Services />
      <Work />
      <Education />
      <About />
      <Contact />
    </>
  );
}

export default function App() {
  const [activeSection, setActiveSection] = useState(null);
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  // Hash targets after cross-route navigation; top of page otherwise.
  useEffect(() => {
    if (location.pathname === "/" && location.hash) {
      const id = decodeURIComponent(location.hash.slice(1));
      const t = setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      }, 60);
      return () => clearTimeout(t);
    }
    if (!location.hash) window.scrollTo(0, 0);
  }, [location.pathname, location.hash]);

  // Active section for the nav. Re-bound whenever the home route mounts.
  useEffect(() => {
    if (location.pathname !== "/") return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    SECTIONS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [location.pathname]);

  return (
    <>
      <Intro />
      <Navbar activeSection={activeSection} theme={theme} toggleTheme={toggleTheme} />
      <main id="main" tabIndex={-1}>
        <Suspense fallback={<div className="route-loading wrap eyebrow">Loading</div>}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/writing" element={<WritingIndex />} />
            <Route path="/writing/:slug" element={<BlogPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
      <BackToTop />
      <Analytics />
    </>
  );
}
