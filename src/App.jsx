import { useEffect, useState } from "react";
import { Suspense, lazy } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar";
import BackToTop from "./components/BackToTop";
import LoadingAnimation from "./components/LoadingAnimation";
import Footer from "./components/Footer";
import BlogLinkPreview from "./components/BlogLinkPreview";

import { useTheme } from "./hooks/useTheme";
import Home from "./sections/Home";
const Work = lazy(() => import("./sections/Work"));
import Experience from "./sections/Experience";
import About from "./sections/About";
import Education from "./sections/Education";
import Contact from "./sections/Contact";

import "./styles/light-theme.css";
import "./styles/page-transitions.css";

const sections = ["services", "work", "experience", "education", "about", "contact"];


const ConstellationGraph = lazy(() => import("./components/ConstellationGraph"));
const BlogPage = lazy(() => import("./components/BlogPage"));
const WritingIndex = lazy(() => import("./components/WritingIndex"));
const NotFound = lazy(() => import("./components/NotFound"));
export default function App() {
  const [activeSection, setActiveSection] = useState(null);
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  // Scroll to hash after navigating from another page
  useEffect(() => {
    if (location.pathname === "/" && location.hash) {
      const id = location.hash.replace("#", "");
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [location]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-40% 0px -40% 0px",
      }
    );

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <LoadingAnimation />
      <Suspense fallback={null}>
        <ConstellationGraph />
      </Suspense>
      <BlogLinkPreview />
      <Navbar activeSection={activeSection} theme={theme} toggleTheme={toggleTheme} />
      <BackToTop />
      <Suspense fallback={<div style={{ padding: '6rem 1.5rem' }}>Loading…</div>}>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Home />
              <Work />
              <Experience />
              <Education />
              <About />
              <Contact />
            </>
          }
        />
        <Route path="/writing" element={<WritingIndex />} />
        <Route path="/writing/:slug" element={<BlogPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      </Suspense>
      <Footer />
    </>
  );
}
