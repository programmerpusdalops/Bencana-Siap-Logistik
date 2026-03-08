---
description: Configure PostgreSQL database using Prisma ORM.
---

This database will support a Disaster Logistics Management System.

# REQUIREMENTS

Create Prisma schema.

Database: PostgreSQL

Create the following core tables:

roles
users
instansi
gudang
jenis_logistik
barang_logistik
satuan

# TABLE STRUCTURES

roles

id
name
created_at

users

id
name
email
password
role_id
instansi_id
created_at

instansi

id
nama_instansi
jenis_instansi

gudang

id
nama_gudang
instansi_id
alamat

jenis_logistik

id
nama_jenis

barang_logistik

id
nama_barang
jenis_logistik_id
satuan_id

satuan

id
nama_satuan

# SECURITY

Passwords must be hashed.

Email must be unique.

# RESULT

Run migration using Prisma.

Database must be ready.