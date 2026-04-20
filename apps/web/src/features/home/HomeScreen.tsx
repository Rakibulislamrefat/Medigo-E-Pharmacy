import { Link, useNavigate } from "react-router-dom";
import { ClipboardList, FileUp, MessageCircle, Search, Stethoscope } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import heroImg from "../../assets/hero.png";
import banner1 from "../../assets/banners/banner-1.svg";
import banner2 from "../../assets/banners/banner-2.svg";
import banner3 from "../../assets/banners/banner-3.svg";
import { useCartStore } from "../cart/cartStore";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { HeroSlider } from "./HeroSlider";
import { getHome } from "./homeApi";
import type { Medicine } from "../../types/domain";
import { demoMedicines } from "../catalog/demoMedicines";
import { ProductCarousel } from "./ProductCarousel";
import { HomeHowItWorks } from "./HomeHowItWorks";
import { HomeFaq } from "./HomeFaq";

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
  const [homeLoading, setHomeLoading] = useState(true);
  const [banners, setBanners] = useState<{ id: string; imageSrc: string; imageAlt: string; title: string; subtitle: string }[]>([]);
  const [categories, setCategories] = useState<FeatureCategory[]>(FEATURE_CATEGORIES);
  const [featured, setFeatured] = useState<Medicine[]>([]);
  const cartItems = useCartStore((s) => s.totalItems());
  const cartSubtotal = useCartStore((s) => s.subtotal());

  const query = useMemo(() => q.trim(), [q]);
  const bdt = useMemo(() => `৳ ${Math.round(cartSubtotal)}`, [cartSubtotal]);

  useEffect(() => {
    let mounted = true;
    async function run() {
      setHomeLoading(true);
      const data = await getHome();
      if (!mounted) return;

      const bannerImages = [banner1, banner2, banner3];
      if (data?.banners?.length) {
        setBanners(
          data.banners.map((b, i) => ({
            id: b.key || `b${i + 1}`,
            imageSrc: b.imageUrl || bannerImages[i % bannerImages.length] || heroImg,
            imageAlt: "",
            title: b.title,
            subtitle: b.subtitle,
          }))
        );
      } else {
        setBanners([
          { id: "b1", imageSrc: banner1, imageAlt: "", title: "Medigo‑EPharmacy", subtitle: "Search medicines fast" },
          { id: "b2", imageSrc: banner2, imageAlt: "", title: "Home delivery in hours", subtitle: "Refill & prescription upload" },
          { id: "b3", imageSrc: banner3, imageAlt: "", title: "Vitamins, personal care & more", subtitle: "Browse categories and deals" },
        ]);
      }

      if (data?.categories?.length) {
        const palette: FeatureCategory["color"][] = ["mint", "pink", "sky", "amber"];
        const mapped = data.categories.slice(0, 12).map((c, idx) => ({
          title: c,
          subtitle: "Browse items",
          color: palette[idx % palette.length]!,
        }));
        setCategories(mapped.length ? mapped : FEATURE_CATEGORIES);
      } else {
        setCategories(FEATURE_CATEGORIES);
      }

      const featuredList = Array.isArray(data?.featuredMedicines) ? data!.featuredMedicines.slice(0, 18) : [];
      setFeatured(featuredList.length ? featuredList : demoMedicines.slice(0, 18));
      setHomeLoading(false);
    }
    run();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <>
      <section className="homeHero">
        <div className="homeHeroGrid">
          <div className="homePromo">
            <div className="homePromoMedia">
              <HeroSlider slides={banners} />
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
                <Button variant="primary" onClick={() => navigate("/doctor-consultation")}>
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
                <Button variant="primary" onClick={() => navigate("/refill-request")}>
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
                <Button variant="primary" onClick={() => navigate("/prescription-upload")}>
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
        <div className="homeQuickActions">
          <button type="button" className="homeQuickAction" onClick={() => navigate("/doctor-consultation")}>
            <div className="homeQuickTitle">Doctor consultation</div>
            <div className="homeQuickSub">Book video/audio appointment</div>
          </button>
          <button type="button" className="homeQuickAction" onClick={() => navigate("/refill-request")}>
            <div className="homeQuickTitle">Refill request</div>
            <div className="homeQuickSub">Reorder quickly from a note</div>
          </button>
          <button type="button" className="homeQuickAction" onClick={() => navigate("/prescription-upload")}>
            <div className="homeQuickTitle">Upload prescription</div>
            <div className="homeQuickSub">Send a photo/PDF</div>
          </button>
          <button type="button" className="homeQuickAction" onClick={() => navigate("/track-order")}>
            <div className="homeQuickTitle">Track order</div>
            <div className="homeQuickSub">Check delivery status</div>
          </button>
        </div>

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
          {categories.map((c) => (
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

        <ProductCarousel title={homeLoading ? "Featured products" : "Featured products"} items={featured} onOpen={(id) => navigate(`/medicines/${id}`)} />

        <HomeHowItWorks />
        <HomeFaq />

        <Card title="Need help?" right={<Button variant="primary" onClick={() => navigate("/medicines")}>Start shopping</Button>}>
          <div className="homeSupportRow">
            <div className="homeSupportLeft">
              <MessageCircle size={18} />
              <div>
                <div className="strong">Need help choosing a medicine?</div>
                <div className="muted">Search by brand/name or browse categories.</div>
              </div>
            </div>
          </div>
        </Card>
      </section>
    </>
  );
}
