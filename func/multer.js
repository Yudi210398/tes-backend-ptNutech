import multer from "multer";
import HttpError from "../init/http-error.js";

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpeg",
};

const simpanFile = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  try {
    const isValid = !!MIME_TYPE_MAP[file.mimetype];
    let error = isValid
      ? null
      : new HttpError("Format Image tidak sesuai", 401);
    return cb(error, isValid);
  } catch (err) {
    console.log(err, `cak`);
  }
};

export const fileUpload = multer({
  storage: simpanFile,
  fileFilter,
});

export const singleUploadMiddleware = (req, res, next) => {
  fileUpload.single(`profile_image`)(req, res, (err) => {
    if (err) {
      // Tangani kesalahan Multer
      if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_UNEXPECTED_FILE") {
          // Jika pengguna mengunggah lebih dari satu file
          return next(new HttpError("Hanya satu file yang diizinkan", 400));
        }
        // Tangani jenis kesalahan Multer lainnya
        return next(new HttpError("Kesalahan saat mengunggah file", 500));
      }
      // Tangani kesalahan lainnya
      return next(err);
    }
    // Lanjutkan ke middleware berikutnya jika tidak ada kesalahan
    next();
  });
};
