import {
  getSQL2JSONShowcaseAPIMock,
  getListCustomersMockHandler,
  getListOrdersMockHandler,
  getListProductsMockHandler,
} from "../../src/api/generated/shop-api";
import type { Customer, Order, Product } from "../../src/api/generated/models";
import { customers, orders, products } from "./data.json";

const meta = () => ({ generatedAt: new Date().toISOString() });
const customerRows = customers as Customer[];
const productRows = products as Product[];
const orderRows = orders as Order[];

export const handlers = [
  // SQL-driven overrides for selected endpoints.
  getListCustomersMockHandler(() => ({ data: customerRows, meta: meta() })),
  getListProductsMockHandler(() => ({ data: productRows, meta: meta() })),
  //   getListMetricsMockHandler(() => ({ data: metrics, meta: meta() })),
  getListOrdersMockHandler(({ request }) => {
    const url = new URL(request.url);
    const customerId = url.searchParams.get("customerId");

    if (!customerId) {
      return { data: orderRows, meta: meta() };
    }

    const numericId = Number(customerId);
    const filteredOrders = orderRows.filter(
      (order) => order.customerId === numericId,
    );

    return { data: filteredOrders, meta: meta() };
  }),

  // Fallback handlers from Orval (faker/examples) for all generated endpoints.
  ...getSQL2JSONShowcaseAPIMock(),
];
