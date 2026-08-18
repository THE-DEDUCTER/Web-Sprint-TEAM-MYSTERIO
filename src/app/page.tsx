"use client";

import Image from "next/image";
import styles from "./page.module.css";
import { 
  Home, Users, Heart, MessageSquare, 
  RefreshCw, Map, Calendar, User, 
  Shield, ShieldCheck
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className={styles.container}>
      {/* Decorative Background Elements */}
      <div className={styles.bgDecoration} style={{ top: '10%', left: '5%' }}><RefreshCw size={24} /></div>
      <div className={styles.bgDecoration} style={{ top: '20%', right: '15%' }}><RefreshCw size={32} /></div>
      <div className={styles.bgDecoration} style={{ top: '40%', left: '20%' }}><RefreshCw size={20} /></div>
      <div className={styles.bgDecoration} style={{ bottom: '30%', right: '10%' }}><RefreshCw size={28} /></div>

      {/* Navbar */}
      <nav className={styles.navbar}>
        <div className={styles.logoContainer}>
          <Image 
            src="/cohort-logo.png" 
            alt="Cohort Logo" 
            width={32} 
            height={32} 
            className={styles.logoImage}
            onError={(e) => {
              // Fallback if image doesn't exist locally
              e.currentTarget.src = "https://www.cohortpccoe.in/cohort-logo.png";
            }}
          />
          <span>Cohort</span>
        </div>
        <button className={styles.signInBtn}>
          <Image 
            src="https://www.google.com/favicon.ico" 
            alt="Google" 
            width={16} 
            height={16} 
          />
          Sign in with Google
        </button>
      </nav>

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            A Social<br />
            Platform for<br />
            PCCOE
          </h1>
          <p className={styles.heroSubtitle}>
            Aggregate discussions, campus navigation, and encrypted<br />
            messaging in real time. Monitor events and track opportunities<br />
            all without juggling multiple logins.
          </p>
          <div className={styles.heroCtas}>
            <button className={styles.btnPrimary}>Get Started</button>
            <button className={styles.btnSecondary}>Explore Platform</button>
          </div>
        </div>

        {/* Floating Glass Widget */}
        <div className={styles.heroWidget}>
          <div className={styles.widgetHeader}>
            <div className={styles.widgetDots}>
              <div className={styles.widgetDot}></div>
              <div className={styles.widgetDot}></div>
              <div className={styles.widgetDot}></div>
            </div>
            <span style={{ marginLeft: "auto", fontSize: "12px", color: "#666" }}>Today's App Interactions</span>
          </div>
          <div className={styles.widgetNumber}>
            <span style={{ fontSize: "24px", color: "#9ca3af" }}>👁</span>
            11,510
            <span className={styles.widgetBadge}>+7.5%</span>
          </div>
          <p className={styles.widgetTitle} style={{ marginTop: "1rem" }}>Activity in real time</p>
          <div className={styles.widgetChart}>
            {[40, 30, 50, 45, 60, 80, 55, 65, 50, 45, 70].map((height, i) => (
              <div key={i} className={styles.chartBar} style={{ height: `${height}%` }}></div>
            ))}
          </div>
        </div>
      </section>

      {/* Connecting Communities */}
      <section className={styles.communitiesSection}>
        <h2 className={styles.communitiesTitle}>Connecting Communities</h2>
        <div className={styles.communitiesList}>
          <div className={styles.communityLogo}><Shield size={32} /> OWASP</div>
          <div className={styles.communityLogo}><ShieldCheck size={32} /> GDSC</div>
          <div className={styles.communityLogo}><Users size={32} /> ACM</div>
          <div className={styles.communityLogo}><MessageSquare size={32} /> LBSIT</div>
          <div className={styles.communityLogo}><RefreshCw size={32} /> IOT CLUB</div>
        </div>
      </section>

      {/* Marquee */}
      <div className={styles.marquee}>
        <div className={styles.marqueeText}>
          HORT SOCIAL ✦ CONNECT ✦ DISCOVER ✦ COHORT SOCIAL ✦ CONNECT ✦ DISCOVER ✦ 
        </div>
      </div>

      {/* Explore Platform Features */}
      <section className={styles.featuresSection}>
        <h2 className={styles.featuresTitle}>Explore Platform Features</h2>
        <p className={styles.featuresSubtitle}>
          From encrypted messaging to real-time campus navigation, discover all the<br />
          tools designed to empower your social experience.
        </p>

        <div className={styles.featuresGrid}>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}><Home size={24} /></div>
            <h3 className={styles.featureCardTitle}>Home Feed</h3>
            <p className={styles.featureCardDesc}>
              Stay updated with real-time news, posts, and announcements directly tailored to your campus life.
            </p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}><Users size={24} /></div>
            <h3 className={styles.featureCardTitle}>Communities</h3>
            <p className={styles.featureCardDesc}>
              Join clubs and groups, participate in discussions, and connect with like-minded individuals.
            </p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}><Heart size={24} /></div>
            <h3 className={styles.featureCardTitle}>Friends</h3>
            <p className={styles.featureCardDesc}>
              Build your personal network by adding friends, sending direct messages, and seeing what they are up to.
            </p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}><MessageSquare size={24} /></div>
            <h3 className={styles.featureCardTitle}>Connect</h3>
            <p className={styles.featureCardDesc}>
              Network with alumni, faculty, and industry professionals to advance your career.
            </p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}><RefreshCw size={24} /></div>
            <h3 className={styles.featureCardTitle}>XD (Exchange)</h3>
            <p className={styles.featureCardDesc}>
              A community marketplace where students can buy, sell, or exchange items effortlessly.
            </p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}><Map size={24} /></div>
            <h3 className={styles.featureCardTitle}>Campus Maps</h3>
            <p className={styles.featureCardDesc}>
              Interactive 3D campus navigation powered by TomTom to easily find classrooms, labs, and more.
            </p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}><Calendar size={24} /></div>
            <h3 className={styles.featureCardTitle}>Academic Calendar</h3>
            <p className={styles.featureCardDesc}>
              Never miss an exam, holiday, or important deadline with our integrated academic schedule.
            </p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}><User size={24} /></div>
            <h3 className={styles.featureCardTitle}>Student Profile</h3>
            <p className={styles.featureCardDesc}>
              Showcase your achievements, certifications, and academic record in one professional profile.
            </p>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className={styles.aboutSection}>
        <h2 className={styles.aboutTitle}>About Cohort PCCOE</h2>
        <div className={styles.aboutContent}>
          <p>
            Cohort is the official student/social platform built exclusively for <strong>Pimpri Chinchwad College of Engineering (PCCOE)</strong> Pune. Designed and developed by students, for students, it serves as the central hub where you can connect, collaborate, and stay informed about everything happening on campus.
          </p>
          <p>
            As an internal social media platform, Cohort is a premium UI for the college ecosystem. It aggregates posts from 15+ student communities and clubs — including technical organizations like <strong>OWASP, Google Developer Groups on Campus (GDGC), ACM, and Board of Sports</strong>, as well as creative and social clubs like Art Circle, NSS, and CSI. Students can subscribe to communities, receive real-time post notifications, and participate in discussions without needing to browse multiple WhatsApp groups or Instagram pages.
          </p>
          <p>
            The platform features <strong>end-to-end encrypted messaging</strong> through the Connect module, allowing students to chat privately with friends or in groups. The <strong>XD (Exchange)</strong> module acts as an exclusive marketplace for the campus, enabling students to securely buy, sell, and exchange items, books, and study materials.
          </p>
          <p>
            Cohort also features an <strong>interactive campus map</strong>, powered by TomTom, helping new students navigate PCCOE's sprawling campus. The integrated <strong>academic calendar</strong> keeps everyone synchronized with exam schedules, holidays, and submission deadlines. Students can build their professional presence through <strong>achievement profiles</strong>, showcasing certifications, hackathon wins, and project accomplishments to peers and faculty alike.
          </p>
          <p>
            Built with modern technologies including React, Supabase, and real-time WebSockets, Cohort delivers a fast, responsive experience across devices. The platform prioritizes student privacy, data security, and collaborative tools—making it a digital extension of the PCCOE experience.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerLinks}>
          <div className={styles.footerColumn}>
            <h4 className={styles.footerColumnTitle}>Product</h4>
            <a href="#">Home</a>
            <a href="#">Connect</a>
            <a href="#">Maps</a>
            <a href="#">Profile</a>
          </div>
          <div className={styles.footerColumn}>
            <h4 className={styles.footerColumnTitle}>Company</h4>
            <a href="#">Communities</a>
            <a href="#">Friends</a>
            <a href="#">XD</a>
            <a href="#">Maps</a>
            <a href="#">Calendar</a>
          </div>
        </div>
        
        <div className={styles.footerBottom}>
          <div className={styles.regulatory}>
            <p><strong>Regulatory & Policies</strong></p>
            <p>Please read our terms and privacy policy before using the platform. Powered by <a href="#">Cohort PCCOE</a>.</p>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Image 
              src="https://www.cohortpccoe.in/cohort-logo.png" 
              alt="Cohort" 
              width={40} 
              height={40} 
            />
            <span style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--primary)', fontFamily: 'var(--font-urbanist)' }}>
              Cohort
            </span>
          </div>

          <div className={styles.footerSocials}>
            <a href="#">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
            </a>
            <a href="#">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
            </a>
            <a href="#">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/><path d="m10 15 5-3-5-3z"/></svg>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
