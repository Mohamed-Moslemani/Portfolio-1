import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import CustomCursor from "./components/CustomCursor";
import BackToTop from "./components/BackToTop";
import LoadingAnimation from "./components/LoadingAnimation";
import Footer from "./components/Footer";
import BlogLinkPreview from "./components/BlogLinkPreview";
import { Suspense, lazy } from "react";
const AmbientAnimation = lazy(() => import("./components/AmbientAnimation"));
const ConstellationGraph = lazy(() => import("./components/ConstellationGraph"));
import { Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import { useTheme } from "./hooks/useTheme";
import Home from "./sections/Home";
import Work from "./sections/Work";
import Experience from "./sections/Experience";
import About from "./sections/About";
import Contact from "./sections/Contact";
const BlogPage = lazy(() => import("./components/BlogPage"));
const WritingIndex = lazy(() => import("./components/WritingIndex"));
const NotFound = lazy(() => import("./components/NotFound"));
import "./styles/light-theme.css";
import "./styles/page-transitions.css";
const sections = ["work", "experience", "about", "contact"]; // remove writing from intersection tracking

export default function App() {
  const [activeSection, setActiveSection] = useState(null);
  const { theme, toggleTheme } = useTheme();

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
      <CustomCursor />
      <Suspense fallback={null}>
        <AmbientAnimation />
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
