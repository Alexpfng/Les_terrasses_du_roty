import { useId, useRef, useState } from "react";
import { gsap } from "@/terrasse/lib/gsapSetup";
import { ANIM } from "@/terrasse/lib/animConfig";
import { prefersReducedMotion } from "@/terrasse/hooks/useReducedMotion";

export interface FaqItem {
  q: string;
  a: string;
}

interface AccordionProps {
  items: FaqItem[];
}

/** FAQ accessible : vrais boutons, aria-expanded, animation height GSAP. */
export const Accordion = ({ items }: AccordionProps) => {
  const [open, setOpen] = useState<number | null>(null);
  const bodies = useRef<Array<HTMLDivElement | null>>([]);
  const baseId = useId();

  const toggle = (i: number) => {
    const next = open === i ? null : i;
    const animate = !prefersReducedMotion();
    bodies.current.forEach((el, j) => {
      if (!el) return;
      const shouldOpen = j === next;
      const h = shouldOpen ? el.scrollHeight : 0;
      if (animate) {
        gsap.to(el, { height: h, duration: ANIM.faq.duration, ease: "power2.inOut" });
      } else {
        el.style.height = `${h}px`;
      }
    });
    setOpen(next);
  };

  return (
    <div style={{ borderBottom: "1px solid rgba(10,9,8,0.16)" }}>
      {items.map((item, i) => {
        const isOpen = open === i;
        const panelId = `${baseId}-panel-${i}`;
        return (
          <div key={item.q} style={{ borderTop: "1px solid rgba(10,9,8,0.16)" }}>
            <button
              type="button"
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() => toggle(i)}
              data-hover="1"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 20,
                width: "100%",
                padding: "24px 0",
                background: "none",
                border: "none",
                cursor: "pointer",
                textAlign: "left",
                fontFamily: "var(--font-display)",
                fontWeight: 500,
                fontSize: "clamp(18px, 1.8vw, 23px)",
                color: "var(--ltdr-black)",
              }}
            >
              {item.q}
              <span
                aria-hidden="true"
                style={{
                  fontFamily: "var(--font-body)",
                  fontWeight: 300,
                  fontSize: 20,
                  color: isOpen ? "var(--ltdr-gold)" : "var(--ltdr-gold-dark)",
                  transition: "transform .4s, color .4s, filter .4s",
                  transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
                  filter: isOpen ? "drop-shadow(0 0 8px rgba(201,162,39,0.4))" : "none",
                }}
              >
                +
              </span>
            </button>
            <div
              id={panelId}
              ref={(el) => {
                bodies.current[i] = el;
              }}
              style={{ height: 0, overflow: "hidden" }}
            >
              <p
                style={{
                  margin: 0,
                  padding: "0 0 26px",
                  fontSize: 14,
                  lineHeight: 1.75,
                  color: "var(--ltdr-ink-65)",
                  maxWidth: 640,
                }}
              >
                {item.a}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
