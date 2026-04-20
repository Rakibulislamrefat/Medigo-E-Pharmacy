import type { ReactNode } from "react";
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { ClipboardList, LogOut, MapPin, PackageSearch, Search, ShoppingCart, Star, Truck, UserCog } from "lucide-react";
import { useMemo, useState } from "react";

import { useApiHealth } from "../../features/system/useApiHealth";
import { useAuthStore } from "../../features/auth/authStore";
import { useCartStore } from "../../features/cart/cartStore";
import { useHomeCategories } from "../../features/home/useHomeCategories";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Container } from "../../components/layout/Container";
import { Stack } from "../../components/layout/Stack";

function HeaderNavLink(props: { to: string; label: string; icon: ReactNode }) {
  return (
    <NavLink
      to={props.to}
      className={({ isActive }) =>
        ["navLink", isActive ? "navLinkActive" : ""].filter(Boolean).join(" ")
      }
    >
      <span className="navLinkIcon">{props.icon}</span>
      <span>{props.label}</span>
    </NavLink>
  );
}

export function AppShell() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const cartCount = useCartStore((s) => s.totalItems());
  const cartSubtotal = useCartStore((s) => s.subtotal());
  const health = useApiHealth();
  const [q, setQ] = useState("");

  const query = useMemo(() => q.trim(), [q]);
  const bdt = useMemo(() => `৳ ${Math.round(cartSubtotal)}`, [cartSubtotal]);
  const categories = useHomeCategories([
    "Personal Care",
    "Baby & Mom",
    "Health Accessories",
    "Sexual Wellbeing",
    "Medicines",
    "Diabetic Care",
    "Women Care",
    "Vitamins & Supplements",
    "Vital Wellness",
  ]);

  const showNav = !["/login", "/register"].includes(location.pathname);

  return (
    <div className="appRoot">
      <header className="appHeader">
        <Container>
          <div className="appHeaderRow appHeaderRowHome">
            <div className="appHeaderLeft">
              <Link to="/" className="brand">
                <span className="brandMark">M</span>
                <span className="brandText">Medigo-EPharmacy</span>
              </Link>
              <Badge tone={health.ok ? "success" : "danger"}>API: {health.ok ? "online" : "offline"}</Badge>
            </div>

            <div className="appHeaderSearch" role="search">
              <div className="appHeaderSearchBox">
                <Search size={16} />
                <input
                  className="appHeaderSearchInput"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search Medicine / ঔষধ খুঁজুন"
                />
              </div>
              <button
                className="appHeaderSearchBtn"
                type="button"
                disabled={!query}
                onClick={() => navigate(`/medicines?q=${encodeURIComponent(query)}`)}
                aria-label="Search"
              >
                <Search size={18} />
              </button>
            </div>

            {showNav ? (
              <nav className="appHeaderNav" aria-label="Primary">
                <HeaderNavLink to="/medicines" label="Medicines" icon={<PackageSearch size={18} />} />
                {user ? (
                  <>
                    <HeaderNavLink
                      to="/cart"
                      label={`Cart${cartCount ? ` (${cartCount})` : ""}`}
                      icon={<ShoppingCart size={18} />}
                    />
                    <HeaderNavLink to="/orders" label="Orders" icon={<ClipboardList size={18} />} />
                    <HeaderNavLink to="/feedback" label="Feedback" icon={<Star size={18} />} />
                    {user.role === "admin" ? (
                      <HeaderNavLink to="/admin/inventory" label="Inventory" icon={<UserCog size={18} />} />
                    ) : null}
                    {user.role === "admin" ? (
                      <HeaderNavLink to="/admin/banners" label="Banners" icon={<UserCog size={18} />} />
                    ) : null}
                    {user.role === "admin" ? (
                      <HeaderNavLink to="/admin/prescriptions" label="Rx" icon={<UserCog size={18} />} />
                    ) : null}
                    {user.role === "admin" ? (
                      <HeaderNavLink to="/admin/refill-requests" label="Refill" icon={<UserCog size={18} />} />
                    ) : null}
                    {user.role === "admin" ? (
                      <HeaderNavLink to="/admin/consultations" label="Consult" icon={<UserCog size={18} />} />
                    ) : null}
                    {user.role === "delivery" ? (
                      <HeaderNavLink to="/delivery" label="Delivery" icon={<Truck size={18} />} />
                    ) : null}
                  </>
                ) : (
                  <HeaderNavLink
                    to="/cart"
                    label={`Cart${cartCount ? ` (${cartCount})` : ""}`}
                    icon={<ShoppingCart size={18} />}
                  />
                )}
              </nav>
            ) : null}

            <div className="appHeaderRight">
              {user ? (
                <>
                  <Badge tone="neutral">{user.email}</Badge>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      logout();
                      navigate("/login", { replace: true });
                    }}
                    leftIcon={<LogOut size={16} />}
                  >
                    Sign out
                  </Button>
                </>
              ) : (
                <>
                  <NavLink to="/track-order" className="topLink">
                    <MapPin size={16} />
                    Track Order
                  </NavLink>
                  <Button variant="ghost" onClick={() => navigate("/login")}>Sign in</Button>
                  <Button variant="secondary" onClick={() => navigate("/register")}>Sign up</Button>
                </>
              )}
            </div>
          </div>

          {showNav ? (
            <nav className="categoryBar" aria-label="Categories">
              {categories.map((c) => (
                <button
                  key={c}
                  type="button"
                  className="categoryLink"
                  onClick={() => navigate(`/medicines?category=${encodeURIComponent(c)}`)}
                >
                  {c}
                </button>
              ))}
              <div className="categoryBarSpacer" />
              <Link to="/cart" className="categoryCart">
                <span className="categoryCartItems">{cartCount} Item(s)</span>
                <span className="categoryCartPrice">{bdt}</span>
              </Link>
            </nav>
          ) : null}
        </Container>
      </header>

      <main className="appMain">
        <Container>
          <Stack gap={16}>
            <Outlet />
          </Stack>
        </Container>
      </main>
    </div>
  );
}
