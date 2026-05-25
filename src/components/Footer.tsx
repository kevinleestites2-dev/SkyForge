import React from 'react';
import AppLogo from '@/components/ui/AppLogo';


export default function Footer() {
  return (
    <footer className="border-t border-border py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
        {/* Logo + Copyright */}
        <div className="flex items-center gap-3">
          <AppLogo size={28} />
          <span className="font-sans font-black text-sm tracking-tighter text-foreground">
            Poké<span className="text-gradient-blue">Forge</span>
          </span>
          <span className="text-muted-foreground text-sm hidden sm:block">
            © 2026 SkyForge. All rights reserved.
          </span>
        </div>

        {/* Links */}
        <nav className="flex items-center gap-6 sm:gap-8">
          {[
            { label: 'Features', href: '#features' },
            { label: 'Worlds', href: '#worlds' },
            { label: 'Privacy', href: '#' },
            { label: 'Terms', href: '#' },
          ]?.map((link) => (
            <a
              key={link?.label}
              href={link?.href}
              className="text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:text-foreground"
            >
              {link?.label}
            </a>
          ))}
        </nav>

        {/* Social */}
        <div className="flex items-center gap-4">
          {[
            { label: 'Twitter / X', href: '#', icon: 'M' },
            { label: 'Discord', href: '#', icon: 'D' },
            { label: 'GitHub', href: '#', icon: 'G' },
          ]?.map((s) => (
            <a
              key={s?.label}
              href={s?.href}
              aria-label={s?.label}
              className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-[11px] font-black text-muted-foreground hover:text-primary hover:border-primary transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {s?.icon}
            </a>
          ))}
        </div>

        <span className="text-muted-foreground text-sm sm:hidden text-center">
          © 2026 SkyForge.
        </span>
      </div>
    </footer>
  );
}