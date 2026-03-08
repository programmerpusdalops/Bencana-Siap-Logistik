---
trigger: always_on
---

# DATABASE DESIGN RULES
Disaster Logistics Management System

This document defines the database architecture for the backend.

Database engine:
PostgreSQL

ORM:
Prisma

All database tables must follow the rules defined in this document.

--------------------------------------------------

# GENERAL DATABASE RULES

1. Use snake_case for all table and column names.

Example:

created_at
updated_at
barang_logistik

2. All tables must have primary key:

id

Type:

integer auto increment

3. All tables must include timestamps:

created_at
updated_at

4. Use foreign keys for relational data.

5. Use indexes for frequently queried fields.

--------------------------------------------------

# CORE DATABASE MODULES

The system database is divided into modules:

Authentication
User Management
Master Data
Warehouse Stock
Incoming Logistics
Disaster Events
Logistics Requests
Distribution
Receiving Confirmation
Dashboard Analytics

--------------------------------------------------

# AUTHENTICATION TABLES

TABLE: roles

Fields:

id
name
created_at
updated_at

Example roles:

super_admin
admin_gudang
admin_pusdalops
petugas_posko
pimpinan

--------------------------------------------------

TABLE: users

Fields:

id
name
email
password
role_id
instansi_id
created_at
updated_at

Rules:

email must be unique

password must be hashed using bcrypt

--------------------------------------------------

# MASTER DATA TABLES

TABLE: instansi

Fields:

id
nama_instansi
jenis_instansi
created_at
updated_at

Example data:

BPBD
DINSOS
DINAS PANGAN
DONATUR

--------------------------------------------------

TABLE: gudang

Fields:

id
nama_gudang
instansi_id
alamat
created_at
updated_at

--------------------------------------------------

TABLE: satuan

Fields:

id
nama_satuan
created_at
updated_at

Example:

Kg
Pcs
Liter
Box

--------------------------------------------------

TABLE: jenis_logistik

Fields:

id
nama_jenis
created_at
updated_at

Example:

Pangan
Sandang
Peralatan
Medis

--------------------------------------------------

TABLE: barang_logistik

Fields:

id
nama_barang
jenis_logistik_id
satuan_id
created_at
updated_at

Example:

Beras
Mie Instan
Air Mineral
Selimut

--------------------------------------------------

# STOCK MANAGEMENT

TABLE: stok_logistik

Fields:

id
barang_id
gudang_id
jumlah
expired_date
kondisi
created_at
updated_at

Example kondisi:

baik
rusak
expired

Business rule:

Stock must increase when incoming logistics recorded.

Stock must decrease when distribution occurs.

--------------------------------------------------

# INCOMING LOGISTICS

TABLE: barang_masuk

Fields:

id
tanggal_masuk
barang_id
jumlah
gudang_id
sumber_logistik
supplier
catatan
created_at
updated_at

Example sumber_logistik:

APBD
BNPB
DONASI
CSR

--------------------------------------------------

# DISASTER EVENTS

TABLE: bencana

Fields:

id
jenis_bencana
lokasi
latitude
longitude
tanggal
jumlah_pengungsi
jumlah_korban
created_at
updated_at

Example jenis_bencana:

Banjir
Gempa
Longsor
Tsunami

--------------------------------------------------

# LOGISTICS REQUEST

TABLE: permintaan_logistik

Fields:

id
bencana_id
pemohon_id
status
tanggal
created_at
updated_at

Example status:

pending
approved
rejected
processed
completed

--------------------------------------------------

TABLE: permintaan_detail

Fields:

id
permintaan_id
barang_id
jumlah
created_at
updated_at

--------------------------------------------------

# DISTRIBUTION MANAGEMENT

TABLE: distribusi

Fields:

id
permintaan_id
gudang_id
tanggal_kirim
kendaraan_id
petugas_id
status
created_at
updated_at

Example status:

pending
on_delivery
delivered
completed

--------------------------------------------------

TABLE: distribusi_detail

Fields:

id
distribusi_id
barang_id
jumlah
created_at
updated_at

--------------------------------------------------

# RECEIVING CONFIRMATION

TABLE: penerimaan_logistik

Fields:

id
distribusi_id
tanggal_terima
petugas_posko
catatan
dokumentasi
created_at
updated_at

--------------------------------------------------

# VEHICLE DATA

TABLE: kendaraan

Fields:

id
nama_kendaraan
nomor_polisi
kapasitas
created_at
updated_at

Example:

Truck BPBD
Pickup Logistik

--------------------------------------------------

# INDEXING RULES

Indexes should be added for frequently used fields.

Examples:

users.email
stok_logistik.barang_id
stok_logistik.gudang_id
permintaan_logistik.status
bencana.tanggal

--------------------------------------------------

# RELATIONSHIP OVERVIEW

roles
   |
   |---- users

instansi
   |
   |---- users
   |
   |---- gudang

jenis_logistik
   |
   |---- barang_logistik

barang_logistik
   |
   |---- stok_logistik
   |
   |---- permintaan_detail
   |
   |---- distribusi_detail

gudang
   |
   |---- stok_logistik
   |
   |---- barang_masuk
   |
   |---- distribusi

bencana
   |
   |---- permintaan_logistik

permintaan_logistik
   |
   |---- permintaan_detail
   |
   |---- distribusi

distribusi
   |
   |---- distribusi_detail
   |
   |---- penerimaan_logistik

--------------------------------------------------

# IMPORTANT DATABASE RULES

1. Never delete important records permanently.

Use soft delete if necessary.

2. Maintain referential integrity using foreign keys.

3. Use transactions for operations involving stock updates.

Example:

distribution must reduce stock safely.

--------------------------------------------------

# FUTURE EXTENSION

Database should allow future modules such as:

logistics need analysis
donation tracking
multi warehouse system
regional logistics monitoring

--------------------------------------------------

# FINAL RULE

All backend prompts generating database models must follow this design.

Do not create tables outside this architecture unless required by new features.
