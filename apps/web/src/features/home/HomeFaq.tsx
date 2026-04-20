import { useState } from "react";

const FAQS = [
  {
    q: "Are the medicines genuine?",
    a: "Medigo-EPharmacy is designed to source medicines from licensed suppliers. Always check packaging and expiry dates on delivery.",
  },
  {
    q: "How do I track my order?",
    a: "Use Track Order from the top menu, or sign in and open Orders to see status updates.",
  },
  {
    q: "What payment methods are supported?",
    a: "The app supports a checkout flow that can be integrated with local payment gateways. In the current demo, payment is simulated.",
  },
  {
    q: "Do I need a prescription?",
    a: "For prescription-only medicines, you can upload a prescription and our team can verify it before dispatch.",
  },
];

export function HomeFaq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="homeFaq">
      <div className="homeSectionHeader">
        <h2 className="homeSectionTitle">FAQs</h2>
        <div className="homeSectionSubtitle">Quick answers to common questions.</div>
      </div>

      <div className="homeFaqList">
        {FAQS.map((f, idx) => {
          const isOpen = open === idx;
          return (
            <button
              key={f.q}
              type="button"
              className={["homeFaqItem", isOpen ? "homeFaqItemOpen" : ""].filter(Boolean).join(" ")}
              onClick={() => setOpen((v) => (v === idx ? null : idx))}
            >
              <div className="homeFaqQ">
                <span>{f.q}</span>
                <span className="homeFaqChevron">{isOpen ? "−" : "+"}</span>
              </div>
              {isOpen ? <div className="homeFaqA">{f.a}</div> : null}
            </button>
          );
        })}
      </div>
    </section>
  );
}

