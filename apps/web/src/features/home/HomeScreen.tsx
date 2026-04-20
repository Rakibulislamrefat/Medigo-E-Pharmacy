import { Link, useNavigate } from "react-router-dom";
import { ClipboardList, FileUp, MessageCircle, Search, Stethoscope } from "lucide-react";
import { useMemo, useState } from "react";

import heroImg from "../../assets/hero.png";
import { useCartStore } from "../cart/cartStore";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { HeroSlider } from "./HeroSlider";

type FeatureCategory = {
  title: string;
  subtitle: string;
  color: "mint" | "pink" | "sky" | "amber";
};

const FEATURE_CATEGORIES: FeatureCategory[] = [
  { title: "Personal Care", subtitle: "Skin & hygiene", color: "mint" },
  { title: "Baby & Mom", subtitle: "Baby essentials", color: "pink" },
  { title: "Health Accessories", subtitle: "Devices & tools", color: "sky" },
  { title: "Medicines", subtitle: "Prescription & OTC", color: "amber" },
  { title: "Diabetic Care", subtitle: "Glucose care", color: "mint" },
  { title: "Women Care", subtitle: "Wellbeing", color: "pink" },
  { title: "Vitamins", subtitle: "Supplements", color: "amber" },
  { title: "Vital Wellness", subtitle: "Daily wellness", color: "sky" },
];

export function HomeScreen() {
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const cartItems = useCartStore((s) => s.totalItems());
  const cartSubtotal = useCartStore((s) => s.subtotal());

  const query = useMemo(() => q.trim(), [q]);
  const bdt = useMemo(() => `৳ ${Math.round(cartSubtotal)}`, [cartSubtotal]);

  return (
    <>
      <section className="homeHero">
        <div className="homeHeroGrid">
          <div className="homePromo">
            <div className="homePromoMedia">
              <HeroSlider
                slides={[
                  {
                    id: "s1",
                    imageSrc: heroImg,
                    imageAlt: "",
                    title: "Everything that your skin needs, nothing it doesn’t.",
                    subtitle: "gentle cleansing & extra TLC",
                  },
                  {
                    id: "s2",
                    imageSrc: heroImg,
                    imageAlt: "",
                    title: "Order medicines fast with home delivery.",
                    subtitle: "trusted e‑pharmacy experience",
                  },
                  {
                    id: "s3",
                    imageSrc: heroImg,
                    imageAlt: "",
                    title: "Search. Add to cart. Checkout.",
                    subtitle: "simple shopping flow",
                  },
                ]}
              />
            </div>

            <div className="homePromoContent">
              <div className="homePromoTop">
                <div className="homePromoKicker">gentle cleansing & extra TLC</div>
                <div className="homePromoKickerSub">for sensitive skin</div>
              </div>

              <div className="homePromoTitle">Everything that your skin needs, nothing it doesn’t.</div>

              <div className="homePromoBadges">
                <div className="homeIconPill">Loving</div>
                <div className="homeIconPill">Uncomplicated formula</div>
                <div className="homeIconPill">Fuss‑free routine</div>
              </div>

              <div className="homePromoActions">
                <div className="homePromoSearch">
                  <div className="homeSearchBox">
                    <Search size={16} />
                    <Input
                      value={q}
                      onChange={setQ}
                      placeholder="Search Medicine / ঔষধ খুঁজুন"
                    />
                  </div>
                  <Button
                    variant="primary"
                    disabled={!query}
                    onClick={() => navigate(`/medicines?q=${encodeURIComponent(query)}`)}
                  >
                    Search
                  </Button>
                </div>

                <Button variant="secondary" onClick={() => navigate("/medicines")}>
                  Browse Medicines
                </Button>
              </div>
            </div>
          </div>

          <div className="homeServices">
            <div className="homeServiceCard homeServiceCardSky">
              <div className="homeServiceIcon">
                <Stethoscope size={18} />
              </div>
              <div className="homeServiceBody">
                <div className="homeServiceTitle">Doctor Consultation</div>
                <div className="homeServiceText">
                  Video/audio 24 hours. Schedule an appointment now.
                </div>
                <Button variant="primary" onClick={() => {}}>
                  Doctor Consultation
                </Button>
              </div>
            </div>

            <div className="homeServiceCard homeServiceCardPink">
              <div className="homeServiceIcon">
                <ClipboardList size={18} />
              </div>
              <div className="homeServiceBody">
                <div className="homeServiceTitle">Refill Request</div>
                <div className="homeServiceText">Need to order the same products or medicine.</div>
                <Button variant="primary" onClick={() => {}}>
                  Refill Request
                </Button>
              </div>
            </div>

            <div className="homeServiceCard homeServiceCardSkyLight">
              <div className="homeServiceIcon">
                <FileUp size={18} />
              </div>
              <div className="homeServiceBody">
                <div className="homeServiceTitle">Upload Prescription</div>
                <div className="homeServiceText">
                  Upload prescriptions and get your medicine at your doorstep.
                </div>
                <Button variant="primary" onClick={() => {}}>
                  Upload Prescription
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="homeFloatCart" role="complementary" aria-label="Cart summary">
        <Link to="/cart" className="homeFloatCartInner">
          <div className="homeFloatCartTop">{cartItems} Item(s)</div>
          <div className="homeFloatCartMid">
            <span className="homeFloatCartBag" />
          </div>
          <div className="homeFloatCartBottom">{bdt}</div>
        </Link>
      </div>

      <section>
        <div className="pageHeader">
          <div>
            <h2 className="pageTitle" style={{ fontSize: 22 }}>
              Feature Category
            </h2>
          </div>
          <Button variant="ghost" onClick={() => navigate("/medicines") }>
            View all
          </Button>
        </div>

        <div className="homeCategoryRow" role="list">
          {FEATURE_CATEGORIES.map((c) => (
            <button
              key={c.title}
              type="button"
              className={"homeCategoryCard homeCategoryCard" + c.color[0]?.toUpperCase() + c.color.slice(1)}
              onClick={() => navigate(`/medicines?category=${encodeURIComponent(c.title)}`)}
            >
              <div className="homeCategoryTitle">{c.title}</div>
              <div className="homeCategorySub">{c.subtitle}</div>
            </button>
          ))}
        </div>

        <Card title="Popular picks" right={<Button variant="secondary" onClick={() => navigate("/medicines")}>Shop now</Button>}>
          <div className="grid" style={{ gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
            <div className="homePick">
              <div className="homePickTitle">Centrum</div>
              <div className="homePickSub">Vitamins & Supplements</div>
            </div>
            <div className="homePick">
              <div className="homePickTitle">Accu‑Chek</div>
              <div className="homePickSub">Diabetic Care</div>
            </div>
            <div className="homePick">
              <div className="homePickTitle">i‑pill</div>
              <div className="homePickSub">Women Care</div>
            </div>
          </div>

          <div className="divider" />

          <div className="homeSupportRow">
            <div className="homeSupportLeft">
              <MessageCircle size={18} />
              <div>
                <div className="strong">Need help choosing a medicine?</div>
                <div className="muted">Search by brand/name or browse categories.</div>
              </div>
            </div>
            <Button variant="primary" onClick={() => navigate("/medicines")}>Start shopping</Button>
          </div>
        </Card>
      </section>
    </>
  );
}
