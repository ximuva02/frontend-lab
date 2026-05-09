-- Dummy-Testdaten fuer SQL-Transformationen
-- Hinweis: Reihenfolge beachtet Fremdschluesselabhaengigkeiten.

DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS customers;

CREATE TABLE customers (
	customer_id INTEGER PRIMARY KEY,
	full_name VARCHAR(120) NOT NULL,
	email VARCHAR(180) NOT NULL,
	city VARCHAR(80),
	signup_date DATE NOT NULL,
	is_active BOOLEAN NOT NULL
);

CREATE TABLE products (
	product_id INTEGER PRIMARY KEY,
	sku VARCHAR(40) NOT NULL,
	product_name VARCHAR(140) NOT NULL,
	category VARCHAR(60) NOT NULL,
	price DECIMAL(10, 2) NOT NULL,
	stock INTEGER NOT NULL
);

CREATE TABLE orders (
	order_id INTEGER PRIMARY KEY,
	customer_id INTEGER NOT NULL,
	order_date DATE NOT NULL,
	status VARCHAR(30) NOT NULL,
	shipping_city VARCHAR(80) NOT NULL,
	FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
);

CREATE TABLE order_items (
	order_item_id INTEGER PRIMARY KEY,
	order_id INTEGER NOT NULL,
	product_id INTEGER NOT NULL,
	quantity INTEGER NOT NULL,
	unit_price DECIMAL(10, 2) NOT NULL,
	discount_percent DECIMAL(5, 2) NOT NULL,
	FOREIGN KEY (order_id) REFERENCES orders(order_id),
	FOREIGN KEY (product_id) REFERENCES products(product_id)
);

INSERT INTO customers (customer_id, full_name, email, city, signup_date, is_active) VALUES
	(1, 'Jana Hoffmann', 'lena.hoffmann@example.com', 'Berlin', '2025-01-12', TRUE),
	(2, 'Jonas Weber', 'jonas.weber@example.com', 'Hamburg', '2025-02-03', TRUE),
	(3, 'Sofia Klein', 'sofia.klein@example.com', 'Muenchen', '2025-03-18', TRUE),
	(4, 'Mika Neumann', 'mika.neumann@example.com', 'Koeln', '2025-04-07', FALSE),
	(5, 'Emma Schuster', 'emma.schuster@example.com', 'Leipzig', '2025-04-30', TRUE),
	(6, 'Egon Richter', 'noah.richter@example.com', 'Stuttgart', '2025-05-22', TRUE);

INSERT INTO products (product_id, sku, product_name, category, price, stock) VALUES
	(101, 'LP-1001', 'Laptop Pro 14', 'Electronics', 1399.00, 25),
	(102, 'MN-2003', 'Monitor 27 Zoll', 'Electronics', 329.90, 48),
	(103, 'KB-3140', 'Mechanical Keyboard', 'Accessories', 119.50, 120),
	(104, 'MS-4407', 'Wireless Mouse', 'Accessories', 54.99, 210),
	(105, 'CH-5501', 'Office Chair Ergo', 'Furniture', 289.00, 36),
	(106, 'DS-7802', 'USB-C Docking Station', 'Accessories', 179.90, 67),
	(107, 'TB-9002', 'Tablet 11', 'Electronics', 599.00, 40),
	(108, 'HD-1107', 'External SSD 1TB', 'Storage', 129.00, 95);

INSERT INTO orders (order_id, customer_id, order_date, status, shipping_city) VALUES
	(10001, 1, '2026-01-10', 'shipped', 'Berlin'),
	(10002, 2, '2026-01-12', 'processing', 'Hamburg'),
	(10003, 1, '2026-01-19', 'delivered', 'Berlin'),
	(10004, 3, '2026-02-02', 'cancelled', 'Muenchen'),
	(10005, 5, '2026-02-14', 'delivered', 'Leipzig'),
	(10006, 6, '2026-02-20', 'processing', 'Stuttgart'),
	(10007, 2, '2026-03-03', 'shipped', 'Hamburg'),
	(10008, 4, '2026-03-11', 'returned', 'Koeln');

INSERT INTO order_items (order_item_id, order_id, product_id, quantity, unit_price, discount_percent) VALUES
	(1, 10001, 101, 1, 1399.00, 0.00),
	(2, 10001, 103, 1, 119.50, 10.00),
	(3, 10002, 102, 2, 329.90, 5.00),
	(4, 10002, 104, 2, 54.99, 0.00),
	(5, 10003, 108, 1, 129.00, 0.00),
	(6, 10003, 106, 1, 179.90, 15.00),
	(7, 10004, 107, 1, 599.00, 0.00),
	(8, 10005, 105, 1, 289.00, 8.50),
	(9, 10005, 104, 1, 54.99, 0.00),
	(10, 10006, 106, 2, 179.90, 5.00),
	(11, 10007, 103, 3, 119.50, 12.00),
	(12, 10007, 108, 2, 129.00, 0.00),
	(13, 10008, 102, 1, 329.90, 0.00);

-- Optional: schnelle Pruef-Queries
-- SELECT * FROM customers;
-- SELECT * FROM products;
-- SELECT * FROM orders;
-- SELECT * FROM order_items;
