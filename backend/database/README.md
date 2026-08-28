# Database — Import Instructions

This folder contains SQL scripts to create and seed the `labexpress_lis` MySQL database for LABEXPRESS-LIS (Phase 2).

Files:

- `schema.sql` — full DDL to drop/create database and all tables (InnoDB, utf8mb4).
- `seed.sql` — sample data for roles, employees, users, categories, exams, patients, orders, samples, payments and inventory.

How to import with XAMPP / phpMyAdmin:

1. Start XAMPP and ensure Apache + MySQL are running.
2. Open phpMyAdmin (usually http://localhost/phpmyadmin).
3. Select the SQL tab and either upload or paste the contents of `schema.sql` and run it.
4. After `schema.sql` completes, run `seed.sql` (SQL tab → upload/paste) to populate demo data.

How to import via MySQL CLI:

```bash
mysql -u root -p < schema.sql
mysql -u root -p < seed.sql
```

Notes:
- The provided `seed.sql` includes demo users with bcrypt-style hashes for demonstration. Change passwords in production.
- If you prefer to generate bcrypt hashes yourself, a small Node.js script can be used (we can add it in a later step).
- The DB uses utf8mb4 and InnoDB; ensure your MySQL version is 8+.
