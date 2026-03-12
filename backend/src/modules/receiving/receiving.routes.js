const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { authenticate } = require('../../middlewares/auth');
const controller = require('./receiving.controller');

// ─── Multer config for photo upload ─────────────────────────────────────────────
const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, path.join(__dirname, '..', '..', '..', 'uploads'));
    },
    filename: (_req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, `penerimaan-${uniqueSuffix}${path.extname(file.originalname)}`);
    },
});

const fileFilter = (_req, file, cb) => {
    const allowed = ['image/jpeg', 'image/jpg', 'image/png'];
    if (allowed.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Hanya file JPG, JPEG, PNG yang diperbolehkan'), false);
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

router.use(authenticate);

router.get('/', controller.getAll);
router.post('/', upload.single('dokumentasi'), controller.create);

module.exports = router;
