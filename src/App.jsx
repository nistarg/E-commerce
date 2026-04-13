import { useMemo, useState } from "react";
import { categories, products } from "./data/products";
import "./App.css";

function formatPrice(n) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(n);
}

export default function App() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState([]);

  const filtered = useMemo(() => {
    if (activeCategory === "All") return products;
    return products.filter((p) => p.category === activeCategory);
  }, [activeCategory]);

  const cartCount = useMemo(
    () => cart.reduce((sum, line) => sum + line.qty, 0),
    [cart]
  );

  const subtotal = useMemo(
    () => cart.reduce((sum, line) => sum + line.product.price * line.qty, 0),
    [cart]
  );

  function addToCart(product) {
    setCart((prev) => {
      const i = prev.findIndex((l) => l.product.id === product.id);
      if (i >= 0) {
        const next = [...prev];
        next[i] = { ...next[i], qty: next[i].qty + 1 };
        return next;
      }
      return [...prev, { product, qty: 1 }];
    });
    setCartOpen(true);
  }

  function setQty(productId, qty) {
    if (qty < 1) {
      setCart((prev) => prev.filter((l) => l.product.id !== productId));
      return;
    }
    setCart((prev) =>
      prev.map((l) =>
        l.product.id === productId ? { ...l, qty } : l
      )
    );
  }

  function scrollToShop() {
    document.getElementById("shop")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <div className="app">
      <header className="site-header">
        <div className="header-inner">
          <a href="#" className="logo" aria-label="WELL home">
            WELL
          </a>
          <nav aria-label="Primary">
            <ul className="nav-links">
              <li>
                <a href="#shop">Shop</a>
              </li>
              <li>
                <a href="#about">Our story</a>
              </li>
              <li>
                <a href="#newsletter">Journal</a>
              </li>
            </ul>
          </nav>
          <div className="header-actions">
            <button
              type="button"
              className="icon-btn"
              aria-label="Open cart"
              onClick={() => setCartOpen(true)}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
                <path d="M6 6h15l-1.5 9h-12z" />
                <path d="M6 6 5 3H2" />
                <circle cx="9" cy="20" r="1" />
                <circle cx="18" cy="20" r="1" />
              </svg>
              {cartCount > 0 && (
                <span className="cart-badge">{cartCount > 99 ? "99+" : cartCount}</span>
              )}
            </button>
          </div>
        </div>
      </header>

      <section className="hero" aria-labelledby="hero-heading">
        <div className="hero-visual" aria-hidden>
          <img
            src="https://images.unsplash.com/photo-1615485925602-44b6e400f3b8?w=1600&q=80"
            alt=""
          />
          <div className="hero-overlay" />
        </div>
        <div className="hero-content">
          <p className="hero-eyebrow">Spring collection</p>
          <h1 id="hero-heading">Objects &amp; rituals for everyday calm</h1>
          <p>
            Thoughtfully sourced skincare, home, and wellness pieces—chosen
            for texture, purity, and the quiet pleasure of using them.
          </p>
          <div className="hero-cta">
            <button type="button" className="btn btn-primary" onClick={scrollToShop}>
              Shop the edit
            </button>
            <button type="button" className="btn btn-ghost-light" onClick={scrollToShop}>
              View lookbook
            </button>
          </div>
        </div>
      </section>

      <section className="trust-strip" aria-label="Store promises">
        <div className="trust-item">
          <strong>Carbon-neutral shipping</strong>
          <span>Every order offset through our climate partners.</span>
        </div>
        <div className="trust-item">
          <strong>30-day returns</strong>
          <span>Full refund if something does not feel right.</span>
        </div>
        <div className="trust-item">
          <strong>Small-batch makers</strong>
          <span>Transparent sourcing from studios we know.</span>
        </div>
      </section>

      <section id="shop" className="shop">
        <div className="section-head" id="about">
          <h2>The shop</h2>
          <p>
            A tight curation—no endless scroll. Pick a mood, add what speaks
            to you, and we will pack it with care.
          </p>
        </div>
        <div className="filter-row" role="tablist" aria-label="Filter by category">
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              role="tab"
              aria-selected={activeCategory === c}
              className={`filter-pill${activeCategory === c ? " active" : ""}`}
              onClick={() => setActiveCategory(c)}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="product-grid">
          {filtered.map((p) => (
            <article key={p.id} className="product-card">
              <div className="product-card-image-wrap">
                <img src={p.image} alt="" loading="lazy" />
                {p.tag && <span className="product-tag">{p.tag}</span>}
              </div>
              <div className="product-card-body">
                <p className="cat">{p.category}</p>
                <h3>{p.name}</h3>
                <p className="price">{formatPrice(p.price)}</p>
                <button
                  type="button"
                  className="btn-add"
                  onClick={() => addToCart(p)}
                >
                  Add to bag
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="newsletter" className="newsletter" aria-labelledby="newsletter-heading">
        <h2 id="newsletter-heading">Notes from the studio</h2>
        <p>
          Occasional recipes, restocks, and stories behind the makers—no
          clutter.
        </p>
        <form
          className="newsletter-form"
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <input type="email" placeholder="Your email" aria-label="Email" />
          <button type="submit">Subscribe</button>
        </form>
      </section>

      <footer className="site-footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <span className="logo">WELL</span>
            <p>
              Independent shop for calm living. Based on the coast, shipping
              worldwide.
            </p>
          </div>
          <div className="footer-col">
            <h4>Shop</h4>
            <ul>
              <li>
                <a href="#shop">All products</a>
              </li>
              <li>
                <a href="#shop">Skincare</a>
              </li>
              <li>
                <a href="#shop">Home</a>
              </li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Help</h4>
            <ul>
              <li>
                <a href="#">Shipping</a>
              </li>
              <li>
                <a href="#">Returns</a>
              </li>
              <li>
                <a href="#">Contact</a>
              </li>
            </ul>
          </div>
        </div>
        <p className="footer-bottom">
          © {new Date().getFullYear()} WELL. Demo storefront for design exploration.
        </p>
      </footer>

      <div
        className={`cart-backdrop${cartOpen ? " open" : ""}`}
        aria-hidden={!cartOpen}
        onClick={() => setCartOpen(false)}
      />
      <aside
        className={`cart-drawer${cartOpen ? " open" : ""}`}
        aria-label="Shopping bag"
        aria-hidden={!cartOpen}
      >
        <div className="cart-drawer-header">
          <h2>Your bag</h2>
          <button
            type="button"
            className="cart-drawer-close"
            aria-label="Close cart"
            onClick={() => setCartOpen(false)}
          >
            ×
          </button>
        </div>
        <div className="cart-lines">
          {cart.length === 0 ? (
            <p className="cart-empty">Your bag is empty. Add something lovely.</p>
          ) : (
            cart.map((line) => (
              <div key={line.product.id} className="cart-line">
                <div className="cart-line-thumb">
                  <img src={line.product.image} alt="" />
                </div>
                <div className="cart-line-info">
                  <h4>{line.product.name}</h4>
                  <p className="price">{formatPrice(line.product.price)}</p>
                  <div className="cart-line-qty">
                    <button
                      type="button"
                      aria-label="Decrease quantity"
                      onClick={() => setQty(line.product.id, line.qty - 1)}
                    >
                      −
                    </button>
                    <span>{line.qty}</span>
                    <button
                      type="button"
                      aria-label="Increase quantity"
                      onClick={() => setQty(line.product.id, line.qty + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>
                <button
                  type="button"
                  className="cart-line-remove"
                  onClick={() => setQty(line.product.id, 0)}
                >
                  Remove
                </button>
              </div>
            ))
          )}
        </div>
        <div className="cart-footer">
          <div className="cart-subtotal">
            <span>Subtotal</span>
            <strong>{formatPrice(subtotal)}</strong>
          </div>
          <button
            type="button"
            className="cart-checkout"
            disabled={cart.length === 0}
            onClick={() => {
              if (cart.length) alert("Checkout is a demo—thanks for exploring.");
            }}
          >
            Checkout
          </button>
        </div>
      </aside>
    </div>
  );
}
