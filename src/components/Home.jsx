import { useEffect, useRef, useState, useCallback } from "react";
import Lenis from "lenis";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import {
  ArrowUpRight,
  CalendarDays,
  Gem,
  Sparkles,
  Users,
  Star,
  Check,
} from "lucide-react";

import "../styles/global.css";
import "../styles/home.css";

import img1 from "../images/he1.png";
import img2 from "../images/gal3.png";
import img3 from "../images/gal6.jpg";
import img4 from "../images/Page3.png";
import img5 from "../images/gal10.png";
import img6 from "../images/gal6.jpg";
import img7 from "../images/gal10.png";
import img8 from "../images/gal8.jpg";
import img9 from "../images/gal9.jpg";
import img10 from "../images/gal5.jpg";
import img11 from "../images/gal4.jpg";
import img12 from "../images/gal12.png";
import img13 from "../images/gal13.jpg";
import img14 from "../images/gal13.png";
import logo from "../images/logo.png";

/* ============================================================
   CROSSFADE BACKGROUND LAYER
============================================================ */
function CrossfadeBgLayer({ image, scrollYProgress, inputRange, outputRange }) {
  const opacity = useTransform(scrollYProgress, inputRange, outputRange);

  const scale = useTransform(
    scrollYProgress,
    inputRange,
    [1, 1.06, 1.06, 1]
  );

  const shouldRender = useTransform(
    opacity,
    [0, 0.01],
    ["none", "block"]
  );

  return (
    <motion.div
      className="crossfade-bg-layer"
      style={{ opacity, scale, display: shouldRender }}
    >
      <img src={image} alt="" className="crossfade-bg-img" />
    </motion.div>
  );
}

/* ============================================================
   NAV LINK COMPONENT
============================================================ */
function NavLink({ href, children, isActive, onClick }) {
  return (
    <a
      href={href}
      onClick={onClick}
      className={`nav-link ${isActive ? "nav-link--active" : ""}`}
    >
      {children}
      <AnimatePresence>
        {isActive && (
          <motion.span
            className="nav-link-border"
            layoutId="nav-active-border"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
          />
        )}
      </AnimatePresence>
    </a>
  );
}

/* ============================================================
   SVG SOCIAL ICONS
============================================================ */
function InstagramIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

function TikTokIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
    </svg>
  );
}

/* ============================================================
   MAIN COMPONENT
============================================================ */
function Home() {
  const lenisRef = useRef(null);
  const [activeSection, setActiveSection] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const homeRef = useRef(null);
  const [selectedServices, setSelectedServices] = useState([]);
  const [formStatus, setFormStatus] = useState("idle");
  const consultationFormRef = useRef(null);

  // Gallery filter state
  const [galleryFilter, setGalleryFilter] = useState("social");
  const [gallerySubFilter, setGallerySubFilter] = useState("all");

  const { scrollYProgress } = useScroll({
    target: homeRef,
    offset: ["start start", "end end"],
  });

  // Initialize Lenis
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.0,
      smoothWheel: true,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });
    lenisRef.current = lenis;
    let rafId;
    function raf(time) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);
    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  // Lock body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  // Track active section
  useEffect(() => {
    const sectionIds = ["services", "gallery", "process", "consultation"];
    const observers = [];
    sectionIds.forEach((id) => {
      const element = document.getElementById(id);
      if (!element) return;
      const observer = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(id); },
        { rootMargin: "-30% 0px -60% 0px", threshold: 0 }
      );
      observer.observe(element);
      observers.push(observer);
    });
    return () => observers.forEach((obs) => obs.disconnect());
  }, []);

  // Smooth scroll
  const handleNavClick = useCallback((e, href) => {
    e.preventDefault();
    const targetId = href.replace("#", "");
    const target = document.getElementById(targetId);
    if (target && lenisRef.current) {
      lenisRef.current.scrollTo(target, {
        offset: 0,
        duration: 1.0,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      });
      setActiveSection(targetId);
    }
  }, []);

  const toggleService = (service) => {
    setSelectedServices((prev) =>
      prev.includes(service)
        ? prev.filter((s) => s !== service)
        : [...prev, service]
    );
  };

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormStatus("sending");

    const form = consultationFormRef.current;
    if (!form) return;

    const formData = new FormData(form);
    formData.append("Services Interested In", selectedServices.join(", ") || "None selected");

    try {
      const response = await fetch("https://formspree.io/f/xaqkgper", {
        method: "POST",
        body: formData,
        headers: { Accept: "application/json" },
      });

      if (response.ok) {
        setFormStatus("success");
        form.reset();
        setSelectedServices([]);
      } else {
        setFormStatus("error");
      }
    } catch {
      setFormStatus("error");
    }

    setTimeout(() => setFormStatus("idle"), 5000);
  };

  const serviceOptions = [
    "Full Event Planning",
    "Event Design",
    "Event Coordination",
  ];

  // Social media links
  const socialLinks = [
    {
      icon: <InstagramIcon size={18} />,
      href: "https://www.instagram.com/escapeeventsgh?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==",
      label: "Instagram",
    },
    {
      icon: <TikTokIcon size={18} />,
      href: "https://www.tiktok.com/@escapeeventsgh?is_from_webapp=1&sender_device=pc",
      label: "TikTok",
    },
  ];

  // ========================
  // GALLERY DATA — USING IMPORTED IMAGES CORRECTLY
  // ========================
  const galleryImages = [
    // SOCIAL EVENTS - Weddings
    { id: 1, category: "social", subcategory: "weddings", src: img2, span: "large", label: "Luxury Wedding" },
    { id: 2, category: "social", subcategory: "weddings", src: img3, span: "large", label: "Romantic Ceremony" },
    { id: 3, category: "social", subcategory: "weddings", src: img14, span: "wide", label: "Elegant Reception" },
    // SOCIAL EVENTS - Birthday Celebrations
    { id: 4, category: "social", subcategory: "birthday", src: img4, span: "wide", label: "Milestone Birthday" },
    { id: 5, category: "social", subcategory: "birthday", src: img8, span: "large", label: "Birthday Gala" },
    // SOCIAL EVENTS - Bridal Showers
    { id: 6, category: "social", subcategory: "bridal shower", src: img5, span: "wide", label: "Bridal Shower" },
    { id: 7, category: "social", subcategory: "bridal shower", src: img9, span: "large", label: "Bridal Brunch" },
    // SOCIAL EVENTS - Private Dinners
    { id: 8, category: "social", subcategory: "private dinner", src: img10, span: "wide", label: "Private Dinner" },
    { id: 9, category: "social", subcategory: "private dinner", src: img11, span: "large", label: "Intimate Dining" },
    // SOCIAL EVENTS - Engagement Parties
    { id: 10, category: "social", subcategory: "engagement", src: img6, span: "large", label: "Engagement Party" },
    { id: 11, category: "social", subcategory: "engagement", src: img12, span: "wide", label: "Proposal Celebration" },
    // SOCIAL EVENTS - Anniversary Celebrations
    { id: 12, category: "social", subcategory: "anniversary", src: img7, span: "wide", label: "Anniversary Celebration" },
    { id: 13, category: "social", subcategory: "anniversary", src: img13, span: "large", label: "Golden Anniversary" },
    // CORPORATE EVENTS - Brand Launches
    { id: 14, category: "corporate", subcategory: "brand launch", src: img1, span: "wide", label: "Brand Launch" },
    { id: 15, category: "corporate", subcategory: "brand launch", src: img4, span: "large", label: "Product Launch" },
    // CORPORATE EVENTS - Networking Events
    { id: 16, category: "corporate", subcategory: "networking", src: img5, span: "wide", label: "Networking Event" },
    { id: 17, category: "corporate", subcategory: "networking", src: img8, span: "large", label: "Industry Mixer" },
    // CORPORATE EVENTS - Conferences
    { id: 18, category: "corporate", subcategory: "conference", src: img2, span: "wide", label: "Executive Conference" },
    { id: 19, category: "corporate", subcategory: "conference", src: img9, span: "large", label: "Leadership Summit" },
    // CORPORATE EVENTS - Team Experiences
    { id: 20, category: "corporate", subcategory: "team experience", src: img3, span: "wide", label: "Team Building" },
    { id: 21, category: "corporate", subcategory: "team experience", src: img10, span: "large", label: "Corporate Retreat" },
    // CORPORATE EVENTS - End of Year Celebrations
    { id: 22, category: "corporate", subcategory: "eoy celebration", src: img6, span: "wide", label: "End of Year Gala" },
    { id: 23, category: "corporate", subcategory: "eoy celebration", src: img11, span: "large", label: "Holiday Celebration" },
  ];

  const subcategories = {
    social: [
      { key: "weddings", display: "Weddings" },
      { key: "birthday", display: "Birthday Celebrations" },
      { key: "bridal shower", display: "Bridal Showers" },
      { key: "private dinner", display: "Private Dinners" },
      { key: "engagement", display: "Engagement Parties" },
      { key: "anniversary", display: "Anniversary Celebrations" },
    ],
    corporate: [
      { key: "brand launch", display: "Brand Launches" },
      { key: "networking", display: "Networking Events" },
      { key: "conference", display: "Conferences" },
      { key: "team experience", display: "Team Experiences" },
      { key: "eoy celebration", display: "End of Year Celebrations" },
    ],
  };

  const getFilteredGalleryImages = () => {
    let filtered = galleryImages.filter(img => img.category === galleryFilter);
    if (gallerySubFilter !== "all") {
      filtered = filtered.filter(img => img.subcategory === gallerySubFilter);
    }
    return filtered;
  };

  const filteredGallery = getFilteredGalleryImages();

  return (
    <main className="home" ref={homeRef}>
      {/* ============================================
          GLOBAL CROSSFADE BACKGROUND LAYERS
      ============================================ */}
      <div className="crossfade-bg-container">
        <CrossfadeBgLayer image={img1} scrollYProgress={scrollYProgress} inputRange={[0, 0.18, 0.22, 0.25]} outputRange={[1, 1, 0, 0]} />
        <CrossfadeBgLayer image={img2} scrollYProgress={scrollYProgress} inputRange={[0.18, 0.25, 0.38, 0.45]} outputRange={[0, 1, 1, 0]} />
        <CrossfadeBgLayer image={img12} scrollYProgress={scrollYProgress} inputRange={[0.38, 0.45, 0.52, 0.6]} outputRange={[0, 1, 1, 0]} />
        <CrossfadeBgLayer image={img4} scrollYProgress={scrollYProgress} inputRange={[0.52, 0.6, 0.65, 0.72]} outputRange={[0, 1, 1, 0]} />
        <CrossfadeBgLayer image={img11} scrollYProgress={scrollYProgress} inputRange={[0.65, 0.72, 0.77, 0.84]} outputRange={[0, 1, 1, 0]} />
        <CrossfadeBgLayer image={img13} scrollYProgress={scrollYProgress} inputRange={[0.77, 0.84, 0.87, 0.93]} outputRange={[0, 1, 1, 0]} />
        <CrossfadeBgLayer image={img4} scrollYProgress={scrollYProgress} inputRange={[0.87, 0.93, 1, 1]} outputRange={[0, 1, 1, 1]} />
      </div>
      <div className="global-overlay"></div>

      {/* ========================
          NAVIGATION
      ======================== */}
      <motion.nav
        className="nav"
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <a href="#" className="nav-logo">
          <img src={logo} alt="Escape Events" className="nav-logo-img" />
        </a>
        <div className="nav-links">
          <NavLink href="#services" isActive={activeSection === "services"} onClick={(e) => handleNavClick(e, "#services")}>Services</NavLink>
          <NavLink href="#gallery" isActive={activeSection === "gallery"} onClick={(e) => handleNavClick(e, "#gallery")}>Gallery</NavLink>
          <NavLink href="#process" isActive={activeSection === "process"} onClick={(e) => handleNavClick(e, "#process")}>Process</NavLink>
          <a
            href="#consultation"
            className={`nav-cta ${activeSection === "consultation" ? "nav-cta--active" : ""}`}
            onClick={(e) => handleNavClick(e, "#consultation")}
          >
            Inquire
            <AnimatePresence>
              {activeSection === "consultation" && (
                <motion.span className="nav-cta-border" layoutId="nav-cta-border" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} transition={{ type: "spring", stiffness: 380, damping: 30 }} />
              )}
            </AnimatePresence>
          </a>
        </div>
        <button className={`nav-hamburger ${mobileOpen ? "open" : ""}`} onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu">
          <span></span><span></span><span></span>
        </button>
      </motion.nav>

      {/* Mobile overlay */}
      <div className={`nav-mobile-overlay ${mobileOpen ? "open" : ""}`}>
        <a href="#services" className={`nav-mobile-link ${activeSection === "services" ? "nav-mobile-link--active" : ""}`} onClick={(e) => { handleNavClick(e, "#services"); setMobileOpen(false); }}>Services</a>
        <a href="#gallery" className={`nav-mobile-link ${activeSection === "gallery" ? "nav-mobile-link--active" : ""}`} onClick={(e) => { handleNavClick(e, "#gallery"); setMobileOpen(false); }}>Gallery</a>
        <a href="#process" className={`nav-mobile-link ${activeSection === "process" ? "nav-mobile-link--active" : ""}`} onClick={(e) => { handleNavClick(e, "#process"); setMobileOpen(false); }}>Process</a>
        <a href="#consultation" className="nav-mobile-cta" onClick={(e) => { handleNavClick(e, "#consultation"); setMobileOpen(false); }}>Inquire</a>
      </div>

      {/* ========================
          HERO
      ======================== */}
      <section className="hero">
        <div className="hero-content">
          <motion.div className="hero-text-block" initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, delay: 0.4, ease: [0.25, 0.1, 0.25, 1] }}>
            <p className="eyebrow eyebrow-light"><Star size={12} /> Luxury Event Planning &amp; Design</p>
            <h1>Escape<br />Events</h1>
            <p className="hero-subtitle">Crafting unforgettable experiences with emotion, intention, and timeless attention to detail.</p>
            <a href="#consultation" className="btn btn-primary" onClick={(e) => handleNavClick(e, "#consultation")}>Start Planning <ArrowUpRight size={15} /></a>
          </motion.div>
        </div>
        <motion.div className="hero-scroll" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6, duration: 0.8 }}>
          <span></span>Scroll to explore
        </motion.div>
      </section>

      {/* ========================
          INTRO
      ======================== */}
      <section className="intro">
        <div className="intro-container">
          <motion.div className="intro-label" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.7 }}>
            <span className="section-tag section-tag-light">Our Philosophy</span>
          </motion.div>
          <motion.h2 className="intro-heading" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.9, delay: 0.1 }}>
            From concept creation to final execution, our focus is simple
          </motion.h2>
          <motion.p className="intro-body" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.8, delay: 0.25 }}>
            To ensure you enjoy your event stress free while we handle the experience behind the scenes.
          </motion.p>
          <motion.a href="#services" className="btn btn-outline" onClick={(e) => handleNavClick(e, "#services")} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.7, delay: 0.4 }}>
            Explore our services <ArrowUpRight size={15} />
          </motion.a>
        </div>
      </section>

      {/* ========================
          SERVICES
      ======================== */}
      <section className="services-section" id="services">
        <motion.div className="section-header" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.7 }}>
          <span className="section-tag section-tag-light">What We Create</span>
          <h2 className="section-heading section-heading-light">Signature Event Experiences</h2>
        </motion.div>
        <div className="service-grid">
          {[
            { icon: <Gem size={24} />, title: "Luxury Weddings", text: "Elegant ceremonies, receptions, traditional and romantic celebrations designed around your story." },
            { icon: <Sparkles size={24} />, title: "Private Events", text: "Birthdays, bridal showers, intimate dinners, proposals, and exclusive social gatherings." },
            { icon: <Users size={24} />, title: "Corporate Events", text: "Brand launches, conferences, galas, staff celebrations, and executive experiences." },
            { icon: <CalendarDays size={24} />, title: "Event Management", text: "Full-service planning, vendor coordination, timelines, setup supervision, and flawless execution." },
          ].map((item, index) => (
            <motion.div className="service-card service-card-glass" key={item.title} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.7, delay: 0.2 + index * 0.1 }}>
              <div className="service-icon">{item.icon}</div>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
              <span className="service-link">Learn more <ArrowUpRight size={13} /></span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ========================
          EXPERIENCE SHOWCASE
      ======================== */}
      <section className="experience">
        <motion.div className="experience-content" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 1 }}>
          <span className="section-tag section-tag-light">The Experience</span>
          <div className="experience-grid">
            <div className="experience-text">
              <h2>Designed with taste. Managed with calm precision.</h2>
              <p>Our team handles creative direction, logistics, styling, vendor coordination, guest experience, and day of execution, so you can enjoy every moment with absolute confidence.</p>
              <a href="#consultation" className="btn btn-outline" onClick={(e) => handleNavClick(e, "#consultation")}>Begin your experience <ArrowUpRight size={15} /></a>
            </div>
            <motion.div className="experience-image-frame" initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.9, delay: 0.2 }}>
              <img src={img5} alt="Event experience" className="experience-img" />
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* ========================
          GALLERY — WITH CATEGORY FILTERS
      ======================== */}
      <section className="gallery-section" id="gallery">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
        >
          <span className="section-tag section-tag-light">Curated Moments</span>
          <h2 className="section-heading section-heading-light">A visual story in every detail</h2>
        </motion.div>

        {/* Main Category Tabs */}
        <div className="gallery-filter-tabs">
          <button
            className={`gallery-filter-btn ${galleryFilter === "social" ? "active" : ""}`}
            onClick={() => {
              setGalleryFilter("social");
              setGallerySubFilter("all");
            }}
          >
            Social Events
          </button>
          <button
            className={`gallery-filter-btn ${galleryFilter === "corporate" ? "active" : ""}`}
            onClick={() => {
              setGalleryFilter("corporate");
              setGallerySubFilter("all");
            }}
          >
            Corporate Events
          </button>
        </div>

        {/* Subcategory Filters */}
        <div className="gallery-subfilter-strip">
          <button
            className={`gallery-subfilter-btn ${gallerySubFilter === "all" ? "active-sub" : ""}`}
            onClick={() => setGallerySubFilter("all")}
          >
            All {galleryFilter === "social" ? "Social" : "Corporate"}
          </button>
          {subcategories[galleryFilter].map((sub) => (
            <button
              key={sub.key}
              className={`gallery-subfilter-btn ${gallerySubFilter === sub.key ? "active-sub" : ""}`}
              onClick={() => setGallerySubFilter(sub.key)}
            >
              {sub.display}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="gallery-grid">
          {filteredGallery.map((item, index) => (
            <motion.div
              className={`gallery-item gallery-item--${item.span}`}
              key={item.id}
              initial={{ opacity: 0, y: 60, scale: 0.96 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.8, delay: index * 0.05 }}
            >
              <img src={item.src} alt={item.label} />
              <div className="gallery-item-overlay">
                <span className="gallery-item-label">{item.label}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredGallery.length === 0 && (
          <div className="gallery-empty">
            <p>No images in this category yet. New moments being curated.</p>
          </div>
        )}
      </section>

      {/* ========================
          PROCESS
      ======================== */}
      <section className="process-section" id="process">
        <motion.div className="section-header" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.7 }}>
          <span className="section-tag section-tag-light">Our Process</span>
          <h2 className="section-heading section-heading-light">From vision to flawless execution</h2>
        </motion.div>
        <div className="process-list">
          {[
            { num: "01", title: "Consultation", text: "We understand your goals, style, guest count, budget, and the experience you dream of creating." },
            { num: "02", title: "Creative Direction", text: "We shape the concept, moodboard, styling plan, and visual story unique to your event." },
            { num: "03", title: "Planning & Coordination", text: "We coordinate vendors, timelines, layouts, logistics, and every production detail." },
            { num: "04", title: "Flawless Execution", text: "We manage event day so everything feels seamless, calm, and completely effortless." },
          ].map((item, index) => (
            <motion.div className="process-item" key={item.num} initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.7, delay: index * 0.12 }}>
              <span className="process-num">{item.num}</span>
              <div className="process-content"><h3>{item.title}</h3><p>{item.text}</p></div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ========================
          TESTIMONIAL
      ======================== */}
      <section className="testimonial-section">
        <motion.div className="testimonial-content" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.9 }}>
          <span className="section-tag section-tag-light">Client Words</span>
          <blockquote>"Escape Events transformed our wedding into something beyond what we imagined. Every detail felt intentional, and we were able to truly be present and enjoy every single moment."</blockquote>
          <cite>— Sarah &amp; Michael, Wedding 2024</cite>
        </motion.div>
      </section>

      {/* ================================================================
          CONSULTATION
      ================================================================ */}
      <section className="consultation-section" id="consultation">
        <div className="consultation-wrapper">
          <div className="consultation-left">
            <motion.div className="consultation-intro" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.8 }}>
              <span className="section-tag section-tag-light">Begin Your Experience</span>
              <h2>Let's create something extraordinary together.</h2>
              <p>Ready to begin planning your event? We'd love to hear about your vision and explore how Escape Events can bring it to life.</p>
            </motion.div>
            <motion.div className="consultation-booking-card" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.8, delay: 0.2 }}>
              <h3>Book Your Complimentary Consultation</h3>
              <p className="consultation-booking-sub">Select your preferred date and time, and we'll confirm availability within 24 hours.</p>
              <div className="form-row">
                <div className="form-group">
                  <label>Preferred Consultation Date</label>
                  <input type="date" name="Preferred Consultation Date" />
                </div>
                <div className="form-group">
                  <label>Preferred Time</label>
                  <select name="Preferred Consultation Time" defaultValue="">
                    <option value="" disabled>Select a time</option>
                    <option value="morning">Morning (9am – 12pm)</option>
                    <option value="afternoon">Afternoon (12pm – 4pm)</option>
                    <option value="evening">Evening (4pm – 7pm)</option>
                  </select>
                </div>
              </div>
            </motion.div>
          </div>
          <motion.form className="consultation-form" ref={consultationFormRef} onSubmit={handleSubmit} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.8, delay: 0.3 }}>
            <fieldset className="form-fieldset">
              <legend className="form-legend">Client Information</legend>
              <div className="form-row">
                <div className="form-group"><label>Full Name</label><input type="text" name="Full Name" placeholder="Your full name" required /></div>
                <div className="form-group"><label>Email Address</label><input type="email" name="Email Address" placeholder="you@example.com" required /></div>
              </div>
              <div className="form-group"><label>Phone Number(s)</label><input type="tel" name="Phone Number" placeholder="+233 (0) 000 0000" /></div>
            </fieldset>
            <fieldset className="form-fieldset">
              <legend className="form-legend">Event Details</legend>
              <div className="form-row">
                <div className="form-group"><label>Type of Event</label><input type="text" name="Event Type" placeholder="Wedding, Gala, Private Dinner..." /></div>
                <div className="form-group"><label>Event Date</label><input type="text" name="Event Date" placeholder="Month / Year (approximate)" /></div>
              </div>
              <div className="form-row">
                <div className="form-group"><label>Event Location</label><input type="text" name="Event Location" placeholder="City, Venue, or TBD" /></div>
                <div className="form-group">
                  <label>Estimated Budget Range</label>
                  <select name="Budget Range" defaultValue="">
                    <option value="" disabled>Select range</option>
                    <option value="5k-10k">$5,000 – $10,000</option>
                    <option value="10k-25k">$10,000 – $25,000</option>
                    <option value="25k-50k">$25,000 – $50,000</option>
                    <option value="50k-100k">$50,000 – $100,000</option>
                    <option value="100k+">$100,000+</option>
                    <option value="undisclosed">Prefer not to say</option>
                  </select>
                </div>
              </div>
            </fieldset>
            <fieldset className="form-fieldset">
              <legend className="form-legend">Vision & Expectations</legend>
              <div className="form-group"><label>Tell us about your event vision</label><textarea name="Event Vision" placeholder="Describe the experience you're dreaming of..." rows="3"></textarea></div>
              <div className="form-group">
                <label>Which services are you interested in?</label>
                <div className="checkbox-group">
                  {serviceOptions.map((service) => (
                    <label key={service} className={`checkbox-card ${selectedServices.includes(service) ? "checkbox-card--active" : ""}`} onClick={() => toggleService(service)}>
                      <span className="checkbox-icon">{selectedServices.includes(service) && <Check size={14} />}</span>
                      {service}
                    </label>
                  ))}
                </div>
              </div>
              <div className="form-group">
                <label>How did you hear about us?</label>
                <select name="Referral Source" defaultValue="">
                  <option value="" disabled>Select an option</option>
                  <option value="instagram">Instagram</option>
                  <option value="referral">Friend / Family Referral</option>
                  <option value="google">Google Search</option>
                  <option value="vendor">Vendor Recommendation</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </fieldset>
            <div className="form-submit-row">
              <button type="submit" className="btn btn-primary" disabled={formStatus === "sending"}>
                {formStatus === "sending" ? "Sending..." : "Submit Inquiry"}
                {formStatus !== "sending" && <ArrowUpRight size={15} />}
              </button>
              {formStatus === "success" && <span className="form-status form-status--success">Thank you! Your inquiry has been sent. We'll be in touch soon.</span>}
              {formStatus === "error" && <span className="form-status form-status--error">Something went wrong. Please email us directly at hello@escapeevents.com</span>}
            </div>
          </motion.form>
        </div>
      </section>

      {/* ========================
          FOOTER
      ======================== */}
      <footer className="footer">
        <div className="footer-top">
          <a href="#" className="footer-logo">
            <img src={logo} alt="Escape Events" className="footer-logo-img" />
          </a>
          <div className="footer-links">
            <a href="#services" onClick={(e) => handleNavClick(e, "#services")}>Services</a>
            <a href="#gallery" onClick={(e) => handleNavClick(e, "#gallery")}>Gallery</a>
            <a href="#process" onClick={(e) => handleNavClick(e, "#process")}>Process</a>
            <a href="#consultation" onClick={(e) => handleNavClick(e, "#consultation")}>Contact</a>
          </div>
        </div>
        <div className="footer-socials">
          {socialLinks.map((social) => (
            <a key={social.label} href={social.href} target="_blank" rel="noopener noreferrer" className="footer-social-link" aria-label={social.label}>
              {social.icon}
            </a>
          ))}
        </div>
        <div className="footer-bottom">
          <p>&copy; 2025 Escape Events. All rights reserved.</p>
          <p>Luxury in every detail.</p>
        </div>
      </footer>
    </main>
  );
}

export default Home;
