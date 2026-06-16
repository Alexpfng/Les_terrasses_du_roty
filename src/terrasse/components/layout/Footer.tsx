import { LOGOS, SHOP } from '@/terrasse/lib/assets';
import { NewsletterForm } from '@/terrasse/components/ui/NewsletterForm';

const policies = [
  { label: 'Politique de confidentialité', href: SHOP.policies.privacy },
  { label: 'Politique de remboursement', href: SHOP.policies.refund },
  { label: "Conditions d'utilisation", href: SHOP.policies.terms },
  { label: "Politique d'expédition", href: SHOP.policies.shipping },
  { label: 'Conditions générales de vente', href: SHOP.policies.sale },
  { label: 'Mentions légales', href: SHOP.policies.legal },
  { label: 'Contact', href: SHOP.policies.contact },
];

export const Footer = () => (
  <footer style={{ background: 'var(--ltdr-black-deep)', color: 'var(--ltdr-ivory)', padding: '14vh var(--pad-x) 0' }}>
    <div style={{ maxWidth: 1080, margin: '0 auto' }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 'clamp(36px, 5vw, 80px)',
          alignItems: 'center',
        }}
      >
        <div>
          <h3 className="display" style={{ margin: '0 0 18px', fontSize: 'clamp(26px, 3vw, 42px)', lineHeight: 1.15 }}>
            Soyez prévenus avant tout le monde des prochaines cuvées.
          </h3>
          <NewsletterForm />
        </div>
        <img
          src={LOGOS.logoWhite}
          alt="Les Terrasses du Roty"
          width={784}
          height={962}
          loading="lazy"
          data-hover="1"
          className="footer-logo"
          style={{ height: 'clamp(140px, 16vw, 210px)', width: 'auto', justifySelf: 'center', opacity: 0.9, transition: 'filter .6s, opacity .6s' }}
        />
      </div>

      <nav
        aria-label="Liens légaux"
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '14px 28px',
          marginTop: '12vh',
          paddingTop: 36,
          borderTop: '1px solid rgba(244,240,230,0.12)',
        }}
      >
        {policies.map((p) => (
          <a
            key={p.href}
            href={p.href}
            target="_blank"
            rel="noopener noreferrer"
            data-hover="1"
            style={{ color: 'var(--ltdr-ivory-45)', textDecoration: 'none', fontSize: 11, letterSpacing: '0.08em' }}
          >
            {p.label}
          </a>
        ))}
      </nav>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          gap: 12,
          padding: '22px 0 26px',
          fontSize: 11,
          color: 'var(--ltdr-ivory-35)',
        }}
      >
        <span>© 2026 Les Terrasses du Roty — Saulcet, Allier</span>
        <span>Vignoble de Saint-Pourçain</span>
      </div>
    </div>
    <div
      style={{
        background: 'rgba(244,240,230,0.04)',
        borderTop: '1px solid rgba(244,240,230,0.1)',
        margin: '0 calc(var(--pad-x) * -1)',
        padding: '20px 24px',
        textAlign: 'center',
        fontSize: 10,
        letterSpacing: '0.24em',
        textTransform: 'uppercase',
        color: 'var(--ltdr-ivory-55)',
      }}
    >
      L'abus d'alcool est dangereux pour la santé. À consommer avec modération.
    </div>
  </footer>
);
