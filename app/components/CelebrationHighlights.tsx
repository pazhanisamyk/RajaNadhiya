"use client";

import { Flower2, Gem, UtensilsCrossed } from "lucide-react";
import { Reveal } from "./Reveal";

const HIGHLIGHTS = [
  {
    step: "I",
    tag: "Warm Welcome",
    title: "Gathering of Loved Ones",
    detail:
      "Family and friends gather at Chinnaiyal Pazhanisami Mahal amidst floral welcomes, joyful greetings, and cherished reunions.",
    note: "Please arrive comfortably ahead of the ceremony",
    Icon: Flower2,
  },
  {
    step: "II",
    tag: "1:30 PM Onwards",
    title: "The Engagement Ceremony",
    detail:
      "The auspicious moment as Raja and Nadhiya exchange rings and promises of togetherness, surrounded by elders' blessings.",
    note: "Auspicious afternoon muhurtham & ring exchange",
    Icon: Gem,
  },
  {
    step: "III",
    tag: "Celebration & Feast",
    title: "Hospitality & Portraits",
    detail:
      "Share in traditional hospitality, warm conversations, sweet celebrations, and timeless photographs with the newly engaged couple.",
    note: "Warm memories to treasure together",
    Icon: UtensilsCrossed,
  },
];

export function CelebrationHighlights() {
  return (
    <section className="highlights-section" id="highlights">
      <Reveal className="section-heading">
        <p className="section-kicker">The Celebration</p>
        <h2>
          Moments of the <em>afternoon</em>
        </h2>
        <p className="section-subtitle">
          Every blessing and smile makes this milestone unforgettable. Here is
          how our afternoon unfolds together.
        </p>
      </Reveal>

      <div className="highlights-track">
        <span className="highlights-connector" aria-hidden="true" />
        {HIGHLIGHTS.map(({ step, tag, title, detail, note, Icon }, idx) => (
          <Reveal
            key={step}
            delay={idx * 120}
            variant="up"
            className="highlight-item"
          >
            <article className="highlight-card">
              <div className="highlight-top">
                <span className="highlight-step">{step}</span>
                <span className="highlight-tag">{tag}</span>
              </div>
              <div className="highlight-icon-ring">
                <Icon size={21} />
              </div>
              <h3>{title}</h3>
              <p className="highlight-desc">{detail}</p>
              <span className="highlight-note">{note}</span>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

