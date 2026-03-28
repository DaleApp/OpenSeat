"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return ref;
}

function NavBar() {
  return (
    <nav className="fixed top-0 w-full z-50 bg-[#0B1D1A]/80 backdrop-blur-md border-b border-white/5">
      <div className="w-full px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-brand rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">O</span>
          </div>
          <span className="text-white font-semibold text-lg">OpenSeat</span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm text-gray-400 absolute left-1/2 -translate-x-1/2">
          <a href="#features" className="hover:text-white transition-colors duration-300">Features</a>
          <a href="#how-it-works" className="hover:text-white transition-colors duration-300">How it works</a>
          <a href="#about" className="hover:text-white transition-colors duration-300">About</a>
          <a href="#team" className="hover:text-white transition-colors duration-300">Team</a>
          <a href="#contact" className="hover:text-white transition-colors duration-300">Contact</a>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm text-gray-300 hover:text-white transition-colors duration-300 hidden sm:block">
            Sign in
          </Link>
          <Link
            href="/register"
            className="text-sm bg-brand text-white px-4 py-2 rounded-pill hover:bg-brand-dark transition-colors duration-300"
          >
            Get Started
          </Link>
        </div>
      </div>
    </nav>
  );
}

function HeroSection() {
  const ref = useScrollReveal();

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-[#0B1D1A] overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand/20 rounded-full blur-[128px]" />
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-teal-400/10 rounded-full blur-[100px]" />

      <div ref={ref} className="reveal-section relative z-10 max-w-4xl mx-auto px-6 text-center pt-24 pb-20">
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-white leading-tight tracking-tight">
          Your open seat
          <br />
          <span className="text-brand">is waiting</span>
        </h1>

        <p className="text-gray-400 text-lg sm:text-xl max-w-2xl mx-auto mt-6 leading-relaxed">
          Carpooling built for your campus community. Share rides with verified students,
          save money, reduce your footprint, and meet people along the way.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
          <Link
            href="/register"
            className="btn-pulse w-full sm:w-auto bg-brand text-white font-semibold py-3.5 px-8 rounded-pill hover:bg-brand-dark active:scale-[0.98] transition-all text-center"
          >
            Create free account
          </Link>
          <Link
            href="/login"
            className="w-full sm:w-auto bg-white/5 text-white font-semibold py-3.5 px-8 rounded-pill border border-white/10 hover:bg-white/10 active:scale-[0.98] transition-all text-center"
          >
            Sign in
          </Link>
        </div>

        <p className="text-gray-500 text-sm mt-6">
          Free forever for students. No credit card needed.
        </p>

        {/* Stats bar */}
        <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-16 mt-16 pt-8 border-t border-white/5">
          <Stat value="500+" label="Rides shared" />
          <Stat value="2.4t" label="CO2 saved" />
          <Stat value="1,200+" label="Connections made" />
        </div>
      </div>
    </section>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <p className="text-2xl sm:text-3xl font-bold text-white">{value}</p>
      <p className="text-sm text-gray-500 mt-1">{label}</p>
    </div>
  );
}

function FeaturesSection() {
  const features = [
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      ),
      title: "Verified community",
      description: "Only @unc.edu email addresses. Every rider is a real, verified member of your campus.",
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 17h14M5 17a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1l2-3h8l2 3h1a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2M5 17a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2" />
          <circle cx="7.5" cy="14" r="1.5" />
          <circle cx="16.5" cy="14" r="1.5" />
        </svg>
      ),
      title: "Offer or find rides",
      description: "Going somewhere? Publish your ride. Need a lift? Search by destination, time, and vibe.",
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ),
      title: "Vibe matching",
      description: "Chatty, chill, music lover, or study mode? Match with riders who share your energy.",
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
      ),
      title: "Smart meeting points",
      description: "Automatic pickup suggestions based on your location and the driver's route.",
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      ),
      title: "Event-based rides",
      description: "Big game this weekend? Concert on Friday? Find rides organized around campus events.",
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      ),
      title: "Badges & reputation",
      description: "Build trust through ratings, badges, and connections. The more you ride, the more you earn.",
    },
  ];

  const ref = useScrollReveal();

  return (
    <section id="features" className="py-24 bg-surface-secondary">
      <div ref={ref} className="reveal-section max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-brand font-semibold text-sm uppercase tracking-wider mb-3">Features</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-text-primary">
            Everything you need to share the ride
          </h2>
          <p className="text-text-secondary mt-4 max-w-xl mx-auto">
            OpenSeat makes carpooling easy, safe, and social for your campus community.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <div
              key={f.title}
              className="bg-surface-primary border border-border rounded-card p-6 hover:shadow-lg hover:border-brand/20 hover:-translate-y-1 transition-all duration-300"
            >
              <div className="w-10 h-10 bg-brand-light rounded-lg flex items-center justify-center text-brand mb-4">
                {f.icon}
              </div>
              <h3 className="font-semibold text-text-primary text-lg">{f.title}</h3>
              <p className="text-text-secondary text-sm mt-2 leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorksSection() {
  const steps = [
    {
      number: "01",
      title: "Sign up with your .edu email",
      description: "Create your account in seconds. We verify your university email to keep the community safe.",
    },
    {
      number: "02",
      title: "Set up your profile & vibe",
      description: "Add your info, car details (if driving), and pick your ride vibe. Let people know who you are.",
    },
    {
      number: "03",
      title: "Offer or find a ride",
      description: "Heading somewhere? Publish your open seats. Need a lift? Browse rides and request to join.",
    },
  ];

  const ref = useScrollReveal();

  return (
    <section id="how-it-works" className="py-24 bg-surface-primary">
      <div ref={ref} className="reveal-section max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-brand font-semibold text-sm uppercase tracking-wider mb-3">How it works</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-text-primary">
            Three steps to your next ride
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step) => (
            <div key={step.number} className="text-center md:text-left">
              <span className="text-5xl font-bold text-brand/15">{step.number}</span>
              <h3 className="font-semibold text-text-primary text-xl mt-2">{step.title}</h3>
              <p className="text-text-secondary mt-3 leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CommunitySection() {
  const ref = useScrollReveal();

  return (
    <section id="community" className="py-24 bg-[#0B1D1A] relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand/10 rounded-full blur-[150px]" />

      <div ref={ref} className="reveal-section relative z-10 max-w-4xl mx-auto px-6 text-center">
        <p className="text-brand font-semibold text-sm uppercase tracking-wider mb-3">Community first</p>
        <h2 className="text-3xl sm:text-4xl font-bold text-white">
          More than just a ride
        </h2>
        <p className="text-gray-400 text-lg mt-4 max-w-2xl mx-auto leading-relaxed">
          OpenSeat is about the people you meet. Share a 20-minute drive and walk away with a new
          friend, study buddy, or someone who loves the same niche podcast as you.
        </p>

        <div className="grid sm:grid-cols-3 gap-6 mt-16">
          <div className="bg-white/5 border border-white/10 rounded-card p-6">
            <p className="text-3xl font-bold text-white">4.8</p>
            <p className="text-gray-400 text-sm mt-1">Average ride rating</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-card p-6">
            <p className="text-3xl font-bold text-white">85%</p>
            <p className="text-gray-400 text-sm mt-1">Riders connect after trips</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-card p-6">
            <p className="text-3xl font-bold text-brand">$0</p>
            <p className="text-gray-400 text-sm mt-1">Always free for students</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function AboutSection() {
  const ref = useScrollReveal();

  return (
    <section id="about" className="py-24 bg-surface-primary">
      <div ref={ref} className="reveal-section max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-brand font-semibold text-sm uppercase tracking-wider mb-3">About</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-text-primary">
              Built for communities,
              <br />not just campuses
            </h2>
            <p className="text-text-secondary text-lg mt-6 leading-relaxed">
              OpenSeat started at UNC Chapel Hill, but the vision is bigger. Any university,
              company, or organization with a closed community can launch their own
              carpooling network on OpenSeat.
            </p>
            <p className="text-text-secondary text-lg mt-4 leading-relaxed">
              We verify members through their institutional email, so every rider in your
              network is someone who belongs. No strangers, no uncertainty — just your
              people sharing the road.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-surface-secondary rounded-card p-6">
              <p className="text-3xl font-bold text-brand">1</p>
              <p className="text-text-secondary text-sm mt-2">University live</p>
            </div>
            <div className="bg-surface-secondary rounded-card p-6">
              <p className="text-3xl font-bold text-text-primary">Any</p>
              <p className="text-text-secondary text-sm mt-2">.edu domain supported</p>
            </div>
            <div className="bg-surface-secondary rounded-card p-6">
              <p className="text-3xl font-bold text-text-primary">Orgs</p>
              <p className="text-text-secondary text-sm mt-2">Companies welcome</p>
            </div>
            <div className="bg-surface-secondary rounded-card p-6">
              <p className="text-3xl font-bold text-brand">Open</p>
              <p className="text-text-secondary text-sm mt-2">Source & transparent</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function TeamAvatar({ src, initial, name }: { src: string; initial: string; name: string }) {
  const [error, setError] = useState(false);

  if (!src || error) {
    return (
      <div className="w-20 h-20 bg-brand rounded-full flex items-center justify-center mx-auto mb-4">
        <span className="text-3xl text-white font-bold">{initial}</span>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={name}
      width={80}
      height={80}
      className="w-20 h-20 rounded-full object-cover mx-auto mb-4"
      onError={() => setError(true)}
    />
  );
}

function TeamSection() {
  const team = [
    {
      initial: "B",
      name: "Belén Franco",
      role: "Co-Founder | Strategy & Operations",
      description:
        "Business-oriented Industrial Engineer with experience in strategy, operations, and project development. Belén focuses on understanding the full context to identify growth opportunities and execute high-impact initiatives. With a pragmatic and holistic perspective, she bridges strategy with implementation, ensuring ideas translate into concrete results.",
      photoUrl: "/team/belen.jpg",
    },
    {
      initial: "F",
      name: "Florencia Grimaldi",
      role: "Co-Founder | Supply Chain & Data",
      description:
        "Industrial Engineer with experience in global e-commerce, working at the intersection of data, operations, and business. Florencia combines quantitative analysis with operational insight to turn information into actionable decisions. Focused on supply chain, costs, and performance, she ensures end-to-end visibility and identifies optimization opportunities.",
      photoUrl: "/team/florencia.jpg",
    },
    {
      initial: "T",
      name: "Tomás Latorre",
      role: "Co-Founder | Data Engineering",
      description:
        "Data Engineer with experience in designing robust data pipelines, ETL optimization, and scalable data architectures. Proficient in Python, SQL, dBT, BigQuery, and Azure. Tomás brings a strong foundation in data modeling, quality, and governance — turning raw data into reliable infrastructure that powers decisions.",
      photoUrl: "/team/tomas.jpg",
    },
    {
      initial: "N",
      name: "Nicolás González Vedoya",
      role: "Co-Founder | Finance",
      description:
        "Business Economics graduate and Master's in Finance candidate at UTDT. Nicolás brings expertise in financial modeling and digital payments, ensuring OpenSeat's business model is sound and scalable. His analytical rigor and fintech background drive the project's financial strategy.",
      photoUrl: "/team/nicolas.jpg",
    },
  ];

  const ref = useScrollReveal();

  return (
    <section id="team" className="py-24 bg-surface-secondary">
      <div ref={ref} className="reveal-section max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-brand font-semibold text-sm uppercase tracking-wider mb-3">Team</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-text-primary">
            The people behind OpenSeat
          </h2>
          <p className="text-text-secondary mt-4 max-w-xl mx-auto">
            The team building the infrastructure for campus mobility
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {team.map((member) => (
            <div
              key={member.name}
              className="bg-surface-primary border border-border rounded-card p-6 text-center hover:shadow-[0_8px_30px_rgba(13,148,136,0.15)] hover:border-brand/20 hover:-translate-y-1 transition-all duration-300 flex flex-col"
            >
              <TeamAvatar src={member.photoUrl} initial={member.initial} name={member.name} />
              <h3 className="font-bold text-text-primary text-lg">{member.name}</h3>
              <p className="text-brand text-sm font-medium mt-1 min-h-[20px]">{member.role}</p>
              <p className="text-text-secondary text-sm mt-4 leading-relaxed flex-1">
                {member.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ContactSection() {
  const ref = useScrollReveal();

  return (
    <section id="contact" className="py-24 bg-[#0B1D1A] relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand/10 rounded-full blur-[150px]" />

      <div ref={ref} className="reveal-section relative z-10 max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16">
          {/* For students */}
          <div className="bg-white/5 border border-white/10 rounded-card p-8">
            <div className="w-12 h-12 bg-brand/20 rounded-lg flex items-center justify-center text-brand mb-6">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white">I&apos;m a student</h3>
            <p className="text-gray-400 mt-3 leading-relaxed">
              Your university is already on OpenSeat or you want to start sharing rides
              right away? Create your account and get started in seconds.
            </p>
            <Link
              href="/register"
              className="btn-pulse inline-block mt-6 bg-brand text-white font-semibold py-3 px-6 rounded-pill hover:bg-brand-dark active:scale-[0.98] transition-all"
            >
              Get Started
            </Link>
          </div>

          {/* For organizations */}
          <div className="bg-white/5 border border-white/10 rounded-card p-8">
            <div className="w-12 h-12 bg-brand/20 rounded-lg flex items-center justify-center text-brand mb-6">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                <path d="M16 7V5a4 4 0 0 0-8 0v2" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white">I represent an organization</h3>
            <p className="text-gray-400 mt-3 leading-relaxed">
              Want to bring OpenSeat to your university, company, or community?
              Let us know and we&apos;ll set you up with your own private carpooling network.
            </p>
            <a
              href="mailto:hello@openseat-app.com?subject=Bring OpenSeat to my organization"
              className="inline-block mt-6 bg-white/10 text-white font-semibold py-3 px-6 rounded-pill border border-white/20 hover:bg-white/20 active:scale-[0.98] transition-all"
            >
              Request access for your org
            </a>
          </div>
        </div>

        <p className="text-center text-gray-500 text-sm mt-10">
          Questions? Reach us at{" "}
          <a href="mailto:hello@openseat-app.com" className="text-brand hover:underline">
            hello@openseat-app.com
          </a>
        </p>
      </div>
    </section>
  );
}

function CtaSection() {
  const ref = useScrollReveal();

  return (
    <section className="py-24 bg-surface-primary">
      <div ref={ref} className="reveal-section max-w-3xl mx-auto px-6 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-text-primary">
          Ready to share the ride?
        </h2>
        <p className="text-text-secondary text-lg mt-4 max-w-xl mx-auto">
          Join your campus community on OpenSeat. It takes less than a minute to get started.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
          <Link
            href="/register"
            className="btn-pulse w-full sm:w-auto bg-brand text-white font-semibold py-3.5 px-8 rounded-pill hover:bg-brand-dark active:scale-[0.98] transition-all text-center"
          >
            Create free account
          </Link>
          <Link
            href="/login"
            className="w-full sm:w-auto btn-secondary text-center"
          >
            Sign in
          </Link>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-[#0B1D1A] border-t border-white/5 py-12">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">O</span>
            </div>
            <span className="text-white font-semibold">OpenSeat</span>
          </div>

          <div className="flex items-center gap-6 text-sm text-gray-500">
            <a href="#features" className="hover:text-gray-300 transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-gray-300 transition-colors">How it works</a>
            <a href="#about" className="hover:text-gray-300 transition-colors">About</a>
            <a href="#team" className="hover:text-gray-300 transition-colors">Team</a>
            <a href="#contact" className="hover:text-gray-300 transition-colors">Contact</a>
          </div>

          <p className="text-sm text-gray-600">
            &copy; 2026 OpenSeat. Made at UNC.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default function LandingPage() {
  return (
    <>
      <NavBar />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <CommunitySection />
      <AboutSection />
      <TeamSection />
      <ContactSection />
      <CtaSection />
      <Footer />
    </>
  );
}
