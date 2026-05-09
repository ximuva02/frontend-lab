module.exports = {
  customers(row) {
    return {
      id: row.customer_id,
      name: row.full_name,
      email: row.email,
      location: row.city,
      active: row.is_active,
      createdAt: row.signup_date,
    };
  },

  products(row) {
    return {
      id: row.product_id,
      sku: row.sku,
      name: row.product_name,
      category: row.category,
      unitPrice: row.price,
      stock: row.stock,
    };
  },

  orders(row) {
    return {
      id: row.order_id,
      customerId: row.customer_id,
      createdAt: row.order_date,
      state: row.status,
      shippingCity: row.shipping_city,
    };
  },

  order_items(row) {
    return {
      id: row.order_item_id,
      orderId: row.order_id,
      productId: row.product_id,
      quantity: row.quantity,
      price: row.unit_price,
      discountPercent: row.discount_percent,
    };
  },

  //   $postProcess(mapped) {
  //     return {
  //       entities: mapped,
  //       meta: {
  //         generatedAt: new Date().toISOString(),
  //       },
  //     };
  //   },
};
