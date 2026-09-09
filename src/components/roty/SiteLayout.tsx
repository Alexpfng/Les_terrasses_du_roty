import { useState } from "react";
import { useRouterState } from "@tanstack/react-router";

const links = [
  ["/domaine/", "Le domaine"],
  ["/terrasses-pierre-seche/", "Les terrasses"],
  ["/vins/", "Les cuvées"],
  ["/journal/", "Le journal"],
  ["/professionnels/", "Professionnels"],
];

export function SiteLayout({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  return (
    <>
      <a className="skip-link" href="#contenu">
        Aller au contenu
      </a>
      <header className="site-header wrap">
        <nav className="desktop-nav nav-start" aria-label="Navigation principale">
          {links.slice(0, 3).map(([href, label]) => (
            <a key={href} href={href} aria-current={pathname.startsWith(href) ? "page" : undefined}>
              {label}
            </a>
          ))}
        </nav>
        <a className="mobile-contact" href="/demande/">
          Nous écrire
        </a>
        <a href="/" className="brand" aria-label="Les Terrasses du Roty — accueil">
          <img
            src="/assets/img/logo-etiquette-light.svg"
            alt="Les Terrasses du Roty"
            width="212"
            height="260"
          />
        </a>
        <nav className="desktop-nav nav-end" aria-label="Le journal et le domaine">
          {links.slice(3).map(([href, label]) => (
            <a key={href} href={href} aria-current={pathname.startsWith(href) ? "page" : undefined}>
              {label}
            </a>
          ))}
          <a className="header-contact" href="/demande/">
            Nous écrire <span aria-hidden="true">↗</span>
          </a>
        </nav>
        <button
          type="button"
          className="menu-toggle"
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? "Fermer" : "Menu"}
          <span aria-hidden="true">{menuOpen ? "×" : "+"}</span>
        </button>
      </header>
      <nav
        className="mobile-nav wrap"
        id="mobile-nav"
        aria-label="Navigation mobile"
        hidden={!menuOpen}
      >
        {links.map(([href, label]) => (
          <a key={href} href={href}>
            {label}
            <span aria-hidden="true">↗</span>
          </a>
        ))}
        <a href="/demande/">
          Nous contacter <span aria-hidden="true">↗</span>
        </a>
      </nav>
      <noscript>
        <nav className="nojs-nav wrap" aria-label="Navigation sans JavaScript">
          {links.map(([href, label]) => (
            <a key={href} href={href}>
              {label}
            </a>
          ))}
        </nav>
      </noscript>
      <main id="contenu" tabIndex={-1}>
        {children}
      </main>
      <footer className="site-footer">
        <div className="wrap footer-top">
          <a href="/" className="footer-brand">
            <img
              src="/assets/img/logo-etiquette.svg"
              alt="Les Terrasses du Roty"
              width="212"
              height="260"
            />
          </a>
          <div>
            <p className="eyebrow">Saulcet · Allier</p>
            <p className="footer-title">
              Un lieu. Un vin.
              <br />
              <em>Une rencontre.</em>
            </p>
          </div>
          <div className="footer-contact">
            <a className="text-link" href="/demande/">
              Écrire au domaine <span aria-hidden="true">↗</span>
            </a>
            <a href="/professionnels/">Vous êtes professionnel ?</a>
            <span>taff.roty@gmail.com</span>
          </div>
        </div>
        <div className="wrap footer-bottom">
          <p>© Les Terrasses du Roty</p>
          <nav aria-label="Informations légales">
            <a href="/mentions-legales/">Mentions légales</a>
            <a href="/confidentialite/">Confidentialité</a>
            <a href="/conditions-de-vente/">Modalités d’achat</a>
          </nav>
        </div>
        <p className="health wrap">
          L’abus d’alcool est dangereux pour la santé. À consommer avec modération. Vente d’alcool
          interdite aux mineurs.
        </p>
      </footer>
    </>
  );
}

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
  return (
    <picture className={`photo ${className}`}>
      <source
        type="image/avif"
        srcSet={`/assets/img/${name}-800.avif 800w, /assets/img/${name}-1600.avif 1600w`}
        sizes={sizes}
      />
      <source
        type="image/webp"
        srcSet={`/assets/img/${name}-800.webp 800w, /assets/img/${name}-1600.webp 1600w`}
        sizes={sizes}
      />
      <img
        src={`/assets/img/${name}-800.jpg`}
        alt={alt}
        width="800"
        height="600"
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
