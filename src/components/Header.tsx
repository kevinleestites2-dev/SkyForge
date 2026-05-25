'use client';

import React, { useState, useEffect } from 'react';
import AppLogo from '@/components/ui/AppLogo';
import Link from 'next/link';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const navLinks = [
    { label: 'Worlds', href: '#worlds' },
    { label: 'Features', href: '#features' },
    { label: 'The Engine', href: '#engine' },
  ];

  return (
    <>
      <nav
        id="skyforge-nav"
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
          scrolled ? 'py-3' : 'py-6 md:py-8'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className={`flex justify-between items-center rounded-full px-4 sm:px-6 py-2.5 transition-all duration-500 ${
              scrolled
                ? 'glass-dark shadow-[0_8px_32px_rgba(0,0,0,0.4)]'
                : 'bg-transparent'
            }`}
          >
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <AppLogo
                size={36}
                className="transition-transform duration-300 group-hover:rotate-12"
              />
              <span className="font-sans font-black text-lg tracking-tighter text-foreground hidden sm:block">
                Poké<span className="text-gradient-blue">Forge</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks?.map((link) => (
                <a
                  key={link?.label}
                  href={link?.href}
                  className="text-[11px] uppercase tracking-[0.25em] font-bold text-muted-foreground hover:text-foreground transition-colors duration-200"
                >
                  {link?.label}
                </a>
              ))}
            </div>

            {/* CTA */}
            <div className="flex items-center gap-3">
              <a
                href="#forge"
                className="forge-btn hidden sm:flex items-center gap-2 px-5 py-2.5 text-[11px] uppercase tracking-widest font-black"
              >
                <span>Start Forging</span>
              </a>

              {/* Hamburger */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="md:hidden flex flex-col justify-center items-center w-10 h-10 gap-1.5 focus:outline-none"
                aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              >
                <span
                  className={`block w-5 h-0.5 bg-foreground transition-all duration-300 ${
                    menuOpen ? 'rotate-45 translate-y-2' : ''
                  }`}
                />
                <span
                  className={`block w-5 h-0.5 bg-foreground transition-all duration-300 ${
                    menuOpen ? 'opacity-0' : ''
                  }`}
                />
                <span
                  className={`block w-5 h-0.5 bg-foreground transition-all duration-300 ${
                    menuOpen ? '-rotate-45 -translate-y-2' : ''
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </nav>
      {/* Mobile Menu Overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-40 glass-dark flex flex-col items-center justify-center gap-8"
          onClick={() => setMenuOpen(false)}
        >
          <div className="scanline" />
          {navLinks?.map((link) => (
            <a
              key={link?.label}
              href={link?.href}
              onClick={() => setMenuOpen(false)}
              className="text-2xl font-black uppercase tracking-widest text-foreground hover:text-primary transition-colors"
            >
              {link?.label}
            </a>
          ))}
          <a
            href="#forge"
            onClick={() => setMenuOpen(false)}
            className="forge-btn px-8 py-4 text-sm uppercase tracking-widest font-black mt-4"
          >
            <span>Start Forging</span>
          </a>
        </div>
      )}
    </>
  );
}