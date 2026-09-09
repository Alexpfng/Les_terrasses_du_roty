import { useEffect, useRef, useState } from "react";
import { useRouterState } from "@tanstack/react-router";
import { AnalyticsConsent, AnalyticsPreferencesButton } from "./AnalyticsConsent";
import { publishedPaths } from "@/lib/site-routing";
import "../../site-shell.css";

const links = [
  ["/vins/", "Les cuvées"],
  ["/domaine/", "Le domaine"],
  ["/journal/", "Le journal"],
  ["/professionnels/", "Professionnels"],
];

export function SiteLayout({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [enhanced, setEnhanced] = useState(false);
  const menu = useRef<HTMLDialogElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const brand = useRef<HTMLAnchorElement>(null);
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  useEffect(() => {
    setEnhanced(true);
    const desktop = window.matchMedia("(min-width: 1000px)");
    const closeOnDesktop = () => {
      if (desktop.matches && menu.current?.open) {
        setMenuOpen(false);
        menu.current.close();
        brand.current?.focus();
      }
    };
    desktop.addEventListener("change", closeOnDesktop);
    return () => desktop.removeEventListener("change", closeOnDesktop);
  }, []);

  useEffect(() => {
    const dialog = menu.current;
    if (!dialog || !menuOpen) return;
    const previousOverflow = document.body.style.overflow;
    dialog.showModal();
    document.body.style.overflow = "hidden";
    closeButton.current?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
      if (dialog.open) dialog.close();
    };
  }, [menuOpen]);

  return (
    <>
      <a className="skip-link shell-skip-link" href="#contenu">
        Aller au contenu
      </a>
      <header className="shell-header">
        <div className="shell-header-inner shell-width">
          <a
            ref={brand}
            href="/"
            className="shell-brand"
            aria-label="Les Terrasses du Roty — accueil"
          >
            <img src="/assets/img/logo-etiquette-black.svg" alt="" width="212" height="260" />
          </a>
          <nav className="shell-desktop-nav" aria-label="Navigation principale">
            {links.map(([href, label]) => (
              <a
                key={href}
                href={href}
                aria-current={pathname.startsWith(href) ? "page" : undefined}
              >
                {label}
              </a>
            ))}
          </nav>
          <div className="shell-header-actions">
            <a
              className="shell-contact-pill shell-header-contact"
              href="/demande/"
              aria-current={pathname.startsWith("/demande/") ? "page" : undefined}
            >
              Nous contacter
            </a>
            <button
              type="button"
              className="shell-menu-toggle"
              aria-label="Ouvrir le menu"
              aria-expanded={menuOpen}
              aria-controls="mobile-nav"
              aria-haspopup="dialog"
              disabled={!enhanced}
              onClick={() => setMenuOpen(true)}
            >
              <span className="shell-menu-lines" aria-hidden="true">
                <span />
                <span />
              </span>
            </button>
          </div>
        </div>
      </header>
      <dialog
        ref={menu}
        id="mobile-nav"
        className="shell-mobile-menu"
        aria-label="Navigation mobile"
        onCancel={() => setMenuOpen(false)}
        onClose={(event) => {
          if (!event.currentTarget.open) setMenuOpen(false);
        }}
        onKeyDown={(event) => {
          if (event.key !== "Tab") return;
          const controls = Array.from(
            event.currentTarget.querySelectorAll<HTMLElement>(
              'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
            ),
          ).filter(
            (control) =>
              control.tabIndex >= 0 &&
              control.getClientRects().length > 0 &&
              window.getComputedStyle(control).visibility !== "hidden",
          );
          const first = controls[0];
          const last = controls[controls.length - 1];
          if (!first || !last) return;
          if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
          } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
          }
        }}
      >
        <div className="shell-mobile-top">
          <a
            className="shell-brand"
            href="/"
            aria-label="Les Terrasses du Roty — accueil"
            onClick={() => setMenuOpen(false)}
          >
            <img src="/assets/img/logo-etiquette-black.svg" alt="" width="212" height="260" />
          </a>
          <button
            ref={closeButton}
            type="button"
            className="shell-menu-close"
            aria-label="Fermer le menu"
            onClick={() => setMenuOpen(false)}
          >
            <span aria-hidden="true">×</span>
          </button>
        </div>
        <nav className="shell-mobile-links" aria-label="Les pages du domaine">
          {links.map(([href, label]) => (
            <a
              key={href}
              href={href}
              aria-current={pathname.startsWith(href) ? "page" : undefined}
              onClick={() => setMenuOpen(false)}
            >
              {label}
              <span aria-hidden="true">↗</span>
            </a>
          ))}
          <a href="/terrasses-pierre-seche/" onClick={() => setMenuOpen(false)}>
            Les terrasses
            <span aria-hidden="true">↗</span>
          </a>
        </nav>
        <div className="shell-mobile-bottom">
          <a className="shell-contact-pill" href="/demande/" onClick={() => setMenuOpen(false)}>
            Écrire au domaine <span aria-hidden="true">↗</span>
          </a>
          <p>Saulcet · Allier</p>
        </div>
      </dialog>
      <noscript>
        <nav className="shell-nojs-nav shell-width" aria-label="Navigation sans JavaScript">
          {links.map(([href, label]) => (
            <a key={href} href={href}>
              {label}
            </a>
          ))}
          <a href="/terrasses-pierre-seche/">Les terrasses</a>
          <a href="/demande/">Nous contacter</a>
        </nav>
      </noscript>
      <main id="contenu" tabIndex={-1}>
        {children}
      </main>
      <footer className="shell-footer">
        <div className="shell-width">
          <div className="shell-footer-grid">
            <div className="shell-footer-identity">
              <a
                href="/"
                className="shell-footer-logo"
                aria-label="Les Terrasses du Roty — accueil"
              >
                <img
                  src="/assets/img/logo-etiquette-light.svg"
                  alt="Les Terrasses du Roty"
                  width="212"
                  height="260"
                  loading="lazy"
                />
              </a>
              <div>
                <p className="shell-footer-place">Saulcet · Allier</p>
                <p className="shell-footer-statement">
                  Un lieu à découvrir.
                  <br />
                  Un vin à partager.
                </p>
              </div>
            </div>
            <nav className="shell-footer-nav" aria-label="Découvrir le domaine">
              <h2>Découvrir</h2>
              <a href="/vins/">Les cuvées</a>
              <a href="/domaine/">Le domaine</a>
              <a href="/terrasses-pierre-seche/">Les terrasses</a>
              <a href="/journal/">Le journal</a>
            </nav>
            <div className="shell-footer-contact">
              <h2>Restons en contact.</h2>
              <a className="shell-footer-write" href="/demande/">
                Écrire au domaine <span aria-hidden="true">↗</span>
              </a>
              <a href="/professionnels/">Vous êtes professionnel ?</a>
              <span>taff.roty@gmail.com</span>
            </div>
          </div>
          <div className="shell-footer-bottom">
            <p>© Les Terrasses du Roty</p>
            <nav aria-label="Informations légales">
              <a href="/mentions-legales/">Mentions légales</a>
              <a href="/confidentialite/">Confidentialité</a>
              <a href="/conditions-de-vente/">Modalités d’achat</a>
              <AnalyticsPreferencesButton />
            </nav>
          </div>
          <p className="shell-health">
            L’abus d’alcool est dangereux pour la santé. À consommer avec modération. Vente d’alcool
            interdite aux mineurs.
          </p>
        </div>
      </footer>
      <AnalyticsConsent pathname={pathname} allowedPaths={publishedPaths} />
    </>
  );
}

const photoSizes: Record<string, [number, number]> = {
  "bottle-studio": [1122, 1402],
  "wine-reflections": [2848, 4288],
  "wine-silhouette": [2491, 3114],
  "wine-motion": [4912, 7360],
  "wine-tasting": [3456, 5184],
  "wine-cork": [4160, 5925],
  "wine-table": [4160, 6240],
  "roty-vineyard": [4030, 2957],
  "roty-harvest-2024": [3024, 4032],
  "roty-harvest-woman": [1800, 2400],
  "roty-team": [4032, 3024],
  "roty-restoration": [4056, 3040],
  "roty-planting": [4056, 3040],
  "roty-terraces": [4056, 3040],
};

export function Photo({
  name,
  alt,
  className = "",
  eager = false,
  sizes = "(max-width: 767px) 100vw, 55vw",
}: {
  name: string;
  alt: string;
  className?: string;
  eager?: boolean;
  sizes?: string;
}) {
  const dimensions = photoSizes[name] || [1600, 1200];
  const largeWidth = Math.min(dimensions[0], 1600);
  return (
    <picture className={`photo ${className}`}>
      <source
        type="image/avif"
        srcSet={`/assets/img/${name}-800.avif 800w, /assets/img/${name}-1600.avif ${largeWidth}w`}
        sizes={sizes}
      />
      <source
        type="image/webp"
        srcSet={`/assets/img/${name}-800.webp 800w, /assets/img/${name}-1600.webp ${largeWidth}w`}
        sizes={sizes}
      />
      <img
        src={`/assets/img/${name}-800.jpg`}
        alt={alt}
        width="800"
        height={Math.round((800 * dimensions[1]) / dimensions[0])}
        loading={eager ? "eager" : "lazy"}
        {...{ fetchpriority: eager ? "high" : "auto" }}
      />
    </picture>
  );
}
export function ButtonLink({
  href,
  children,
  secondary = false,
}: {
  href: string;
  children: React.ReactNode;
  secondary?: boolean;
}) {
  return (
    <a href={href} className={secondary ? "text-link" : "button"}>
      {children}
      <span aria-hidden="true">↗</span>
    </a>
  );
}
export function Breadcrumb({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav className="breadcrumbs" aria-label="Fil d’Ariane">
      <a href="/">Accueil</a>
      {items.map((item) => (
        <span key={item.label}>
          <span aria-hidden="true"> / </span>
          {item.href ? (
            <a href={item.href}>{item.label}</a>
          ) : (
            <span aria-current="page">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
export function ContactBand() {
  return (
    <section className="contact-band wrap">
      <div>
        <p className="eyebrow">L’échange commence ici</p>
        <h2>
          Quelques bouteilles,
          <br />
          <em>ou une simple question.</em>
        </h2>
        <p>Disponibilités, cuvées, informations professionnelles : parlons-en.</p>
      </div>
      <ButtonLink href="/demande/">Écrire au domaine</ButtonLink>
    </section>
  );
}
