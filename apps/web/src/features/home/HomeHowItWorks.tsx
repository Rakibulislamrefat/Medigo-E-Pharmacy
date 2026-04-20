import { CheckCircle2, Package, Search, Truck } from "lucide-react";

export function HomeHowItWorks() {
  return (
    <section className="homeHow">
      <div className="homeSectionHeader">
        <h2 className="homeSectionTitle">How Medigo-EPharmacy works</h2>
        <div className="homeSectionSubtitle">A simple flow designed for everyday needs.</div>
      </div>

      <div className="homeHowGrid">
        <div className="homeHowCard">
          <div className="homeHowIcon">
            <Search size={18} />
          </div>
          <div className="homeHowTitle">Search</div>
          <div className="homeHowText">Find medicines by name/brand or browse categories.</div>
        </div>
        <div className="homeHowCard">
          <div className="homeHowIcon">
            <Package size={18} />
          </div>
          <div className="homeHowTitle">Add to cart</div>
          <div className="homeHowText">Compare prices, check stock, and add items instantly.</div>
        </div>
        <div className="homeHowCard">
          <div className="homeHowIcon">
            <CheckCircle2 size={18} />
          </div>
          <div className="homeHowTitle">Checkout</div>
          <div className="homeHowText">Provide delivery details and confirm your order.</div>
        </div>
        <div className="homeHowCard">
          <div className="homeHowIcon">
            <Truck size={18} />
          </div>
          <div className="homeHowTitle">Delivery</div>
          <div className="homeHowText">Track order status and receive updates until delivered.</div>
        </div>
      </div>
    </section>
  );
}

