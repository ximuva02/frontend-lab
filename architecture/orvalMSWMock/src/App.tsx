import { useEffect, useMemo, useState } from "react";
import {
  listMetrics,
  listCustomers,
  listOrders,
  listProducts,
} from "./api/generated/shop-api";
import "./App.css";

type Customer = {
  id: number;
  name: string;
  email: string;
  location: string;
  active: boolean;
  createdAt: string;
};

type Product = {
  id: number;
  sku: string;
  name: string;
  category: string;
  unitPrice: number;
  stock: number;
};

type Order = {
  id: number;
  customerId: number;
  createdAt: string;
  state: string;
  shippingCity: string;
};

type Metrics = {
  totalCustomers: number;
  activeCustomers: number;
  totalProducts: number;
  totalOrders: number;
  totalInventory: number;
  averageProductPrice: number;
  ordersByState: Array<{ state: string; count: number }>;
  topShippingCities: Array<{ city: string; count: number }>;
};

type LoadStatus = "idle" | "loading" | "success" | "error";

function App() {
  const [status, setStatus] = useState<LoadStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | "all">(
    "all",
  );

  useEffect(() => {
    async function loadData() {
      setStatus("loading");
      setError(null);

      try {
        const [
          customerResponse,
          productResponse,
          orderResponse,
          metricResponse,
        ] = await Promise.all([
          listCustomers(),
          listProducts(),
          listOrders(),
          listMetrics(),
        ]);

        setCustomers(customerResponse.data.data);
        setProducts(productResponse.data.data);
        setOrders(orderResponse.data.data);
        setMetrics(metricResponse.data.data);
        setStatus("success");
      } catch (loadError) {
        setStatus("error");
        setError(
          loadError instanceof Error ? loadError.message : "Unknown error",
        );
      }
    }

    void loadData();
  }, []);

  const visibleOrders = useMemo(() => {
    if (selectedCustomerId === "all") {
      return orders;
    }

    return orders.filter((order) => order.customerId === selectedCustomerId);
  }, [orders, selectedCustomerId]);

  return (
    <main className="app-shell">
      <header className="hero">
        <p className="eyebrow">Orval + MSW + React</p>
        <h1>OpenAPI Client mit Live-Mock im Browser</h1>
        <p className="subtitle">
          Die Daten kommen aus einem mit Orval generierten TypeScript-Client. In
          der Entwicklungsumgebung faengt MSW die Aufrufe an /customers,
          /products, /orders und /metrics ab.
        </p>
        <div className="hero-badges">
          <span>OpenAPI 3.0</span>
          <span>Type-safe Fetch Client</span>
          <span>MSW Browser Worker</span>
        </div>
      </header>

      <section className="panel status-panel">
        <h2>Status</h2>
        <p>
          Zustand: <strong>{status}</strong>
        </p>
        {error ? <p className="error">Fehler: {error}</p> : null}
      </section>

      <section className="panel status-panel">
        <h2>Metrics Endpoint (/metrics)</h2>
        {metrics ? (
          <>
            <p>
              Customers aktiv: <strong>{metrics.activeCustomers}</strong> von{" "}
              <strong>{metrics.totalCustomers}</strong>
            </p>
            <p>
              Orders gesamt: <strong>{metrics.totalOrders}</strong> |
              Lagerbestand: <strong>{metrics.totalInventory}</strong>
            </p>
            <p>
              Durchschnittspreis:{" "}
              <strong>{metrics.averageProductPrice.toFixed(2)} EUR</strong>
            </p>
          </>
        ) : (
          <p>Keine Metrics geladen.</p>
        )}
      </section>

      <section className="grid">
        <article className="panel">
          <h2>Customers</h2>
          <p>{customers.length} Eintraege</p>
          <ul>
            {customers.map((customer) => (
              <li key={customer.id}>
                <strong>{customer.name}</strong>
                <span>{customer.location}</span>
              </li>
            ))}
          </ul>
        </article>

        <article className="panel">
          <h2>Products</h2>
          <p>{products.length} Eintraege</p>
          <ul>
            {products.map((product) => (
              <li key={product.id}>
                <strong>{product.name}</strong>
                <span>
                  {product.category} - {product.unitPrice.toFixed(2)} EUR
                </span>
              </li>
            ))}
          </ul>
        </article>
      </section>

      <section className="panel orders-panel">
        <div className="orders-header">
          <h2>Orders</h2>
          <label>
            Nach Customer filtern:
            <select
              value={selectedCustomerId}
              onChange={(event) => {
                const value = event.target.value;
                setSelectedCustomerId(value === "all" ? "all" : Number(value));
              }}
            >
              <option value="all">Alle</option>
              {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.name}
                </option>
              ))}
            </select>
          </label>
        </div>
        <ul className="order-list">
          {visibleOrders.map((order) => (
            <li key={order.id}>
              <strong>Order #{order.id}</strong>
              <span>
                Customer {order.customerId} - {order.state} -{" "}
                {order.shippingCity}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

export default App;
