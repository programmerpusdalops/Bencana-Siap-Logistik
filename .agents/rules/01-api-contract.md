---
trigger: always_on
---

# API CONTRACT
Frontend - Backend Integration Rules

This document defines the official API contract between the ReactJS frontend and the ExpressJS backend.

All backend APIs must follow the rules defined in this file.

Do not change endpoint structure unless absolutely necessary.

--------------------------------------------------

# API BASE URL

All endpoints must use the following prefix:

/api

Example:

/api/auth/login
/api/stocks
/api/distribusi

--------------------------------------------------

# STANDARD RESPONSE FORMAT

All API responses must follow the same structure.

SUCCESS RESPONSE

{
  "success": true,
  "message": "Operation successful",
  "data": {}
}

ERROR RESPONSE

{
  "success": false,
  "message": "Error message"
}

--------------------------------------------------

# PAGINATION FORMAT

For endpoints that return list data.

Response format:

{
  "success": true,
  "message": "Data retrieved successfully",
  "data": {
    "items": [],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total_items": 100,
      "total_pages": 10
    }
  }
}

Query parameters supported:

?page=1
?limit=10

Optional:

?search=
?sort=

--------------------------------------------------

# AUTHENTICATION

Authentication uses JWT.

Login endpoint:

POST /api/auth/login

Request body:

{
  "email": "admin@mail.com",
  "password": "password123"
}

Response:

{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "JWT_TOKEN",
    "user": {
      "id": 1,
      "name": "Admin",
      "email": "admin@mail.com",
      "role": "super_admin"
    }
  }
}

--------------------------------------------------

# AUTHORIZATION HEADER

Protected endpoints must use:

Authorization: Bearer TOKEN

Example:

Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9

--------------------------------------------------

# USER API

GET /api/users

Response:

{
 success:true,
 data:[
  {
   id:1,
   name:"Admin",
   email:"admin@mail.com",
   role:"super_admin"
  }
 ]
}

POST /api/users

Request:

{
 name:"John Doe",
 email:"john@mail.com",
 password:"password",
 role_id:2
}

--------------------------------------------------

# MASTER DATA APIs

Jenis Logistik

GET /api/master/jenis-logistik

POST /api/master/jenis-logistik

Barang Logistik

GET /api/master/barang

POST /api/master/barang

Request Example:

{
 nama_barang:"Beras",
 jenis_logistik_id:1,
 satuan_id:1
}

Gudang

GET /api/master/gudang

Instansi

GET /api/master/instansi

--------------------------------------------------

# STOCK API

GET /api/stocks

Response Example:

{
 success:true,
 data:[
  {
   id:1,
   nama_barang:"Beras",
   gudang:"Gudang BPBD",
   jumlah:500,
   satuan:"Kg",
   expired_date:"2026-12-01"
  }
 ]
}

POST /api/stocks

Request:

{
 barang_id:1,
 gudang_id:1,
 jumlah:500,
 expired_date:"2026-12-01",
 kondisi:"baik"
}

--------------------------------------------------

# INCOMING LOGISTICS

GET /api/barang-masuk

POST /api/barang-masuk

Request example:

{
 tanggal_masuk:"2026-03-01",
 barang_id:1,
 jumlah:1000,
 gudang_id:1,
 sumber_logistik:"APBD",
 supplier:"BNPB"
}

Important business rule:

After inserting incoming logistics,
stock must automatically increase.

--------------------------------------------------

# DISASTER EVENTS

GET /api/bencana

POST /api/bencana

Request:

{
 jenis_bencana:"Banjir",
 lokasi:"Palu",
 latitude:-0.8917,
 longitude:119.8707,
 tanggal:"2026-03-05",
 jumlah_pengungsi:200,
 jumlah_korban:3
}

--------------------------------------------------

# LOGISTICS REQUEST

POST /api/permintaan

Request Example:

{
 bencana_id:1,
 items:[
  {
   barang_id:1,
   jumlah:200
  },
  {
   barang_id:2,
   jumlah:100
  }
 ]
}

GET /api/permintaan

Response Example:

{
 success:true,
 data:[
  {
   id:1,
   lokasi:"Palu",
   status:"pending",
   tanggal:"2026-03-05"
  }
 ]
}

--------------------------------------------------

# REQUEST VERIFICATION

Approve request

PATCH /api/permintaan/:id/approve

Reject request

PATCH /api/permintaan/:id/reject

Response:

{
 success:true,
 message:"Request approved"
}

--------------------------------------------------

# DISTRIBUTION API

POST /api/distribusi

Request:

{
 permintaan_id:1,
 gudang_id:1,
 tanggal_kirim:"2026-03-06",
 kendaraan_id:2,
 petugas_id:3,
 items:[
  {
   barang_id:1,
   jumlah:200
  }
 ]
}

Business rule:

After distribution,
stock must decrease.

--------------------------------------------------

# RECEIVING CONFIRMATION

POST /api/penerimaan

Request:

multipart/form-data

Fields:

distribusi_id
jumlah_diterima
catatan
dokumentasi (image file)

Allowed image types:

jpg
jpeg
png

--------------------------------------------------

# DASHBOARD API

GET /api/dashboard/summary

Response:

{
 success:true,
 data:{
  total_stock:12000,
  total_incoming:5000,
  total_distribution:4200,
  total_disasters:12
 }
}

--------------------------------------------------

# ERROR HANDLING

Example errors.

401 Unauthorized

{
 success:false,
 message:"Unauthorized"
}

404 Not Found

{
 success:false,
 message:"Data not found"
}

500 Server Error

{
 success:false,
 message:"Internal server error"
}

--------------------------------------------------

# IMPORTANT RULE

All backend features implemented in this project must follow this API contract.

If a new API is required,
it must follow the same response structure and naming conventions.
