---
description: Create incoming logistics system.
---

# TASK

Create incoming logistics system.

When logistics arrives, stock must increase.

# TABLE

barang_masuk

fields:

id
tanggal_masuk
barang_id
jumlah
gudang_id
sumber_logistik
supplier
catatan

# API

POST /api/barang-masuk
GET /api/barang-masuk

# LOGIC

After insert:

update stok_logistik.

# RESULT

Incoming logistics recorded.