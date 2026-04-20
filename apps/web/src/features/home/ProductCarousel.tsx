import type { Medicine } from "../../types/domain";
import { useCartStore } from "../cart/cartStore";

export function ProductCarousel(props: { title: string; items: Medicine[]; onOpen: (id: string) => void }) {
  const addToCart = useCartStore((s) => s.add);

  return (
    <section>
      <div className="homeCarouselHeader">
        <div className="homeCarouselTitle">{props.title}</div>
      </div>

      <div className="homeCarousel" role="region" aria-label={props.title}>
        <div className="homeCarouselTrack" role="list">
          {props.items.map((m) => (
            <article key={m.id} className="homeCarouselCard" role="listitem">
              <button type="button" className="homeCarouselMedia" onClick={() => props.onOpen(m.id)}>
                <img
                  src={
                    m.imageUrl ||
                    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='520' height='520' viewBox='0 0 520 520'%3E%3Crect width='520' height='520' rx='36' fill='%23F1F5F9'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23647569' font-family='system-ui, -apple-system, Segoe UI, Roboto, Arial' font-size='22' font-weight='800'%3ENo image%3C/text%3E%3C/svg%3E"
                  }
                  alt={m.name}
                  className="homeCarouselImg"
                  loading="lazy"
                />
              </button>

              <div className="homeCarouselBody">
                <button type="button" className="homeCarouselName" onClick={() => props.onOpen(m.id)}>
                  {m.name}
                </button>
                <div className="homeCarouselMeta">
                  <span className="homeCarouselPrice">৳ {Math.round(m.price)}</span>
                  <span className={m.stockQty > 0 ? "homeCarouselStockIn" : "homeCarouselStockOut"}>
                    {m.stockQty > 0 ? "In stock" : "Out"}
                  </span>
                </div>
                <button
                  type="button"
                  className={m.stockQty > 0 ? "homeCarouselAdd" : "homeCarouselAddDisabled"}
                  disabled={m.stockQty <= 0}
                  onClick={() => addToCart(m, 1)}
                >
                  Add to cart
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
