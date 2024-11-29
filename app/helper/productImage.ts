import multer, { StorageEngine, FileFilterCallback } from "multer";
import path from "path";

const storage: StorageEngine = multer.diskStorage({
  destination: function (
    _req: Express.Request,
    _file: Express.Multer.File,
    cb: (error: Error | null, destination: string) => void
  ) {
    cb(null, "uploads/products/");
  },
  filename: function (
    _req: Express.Request,
    file: Express.Multer.File,
    cb: (error: Error | null, filename: string) => void
  ) {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  },
});

export const productImage = multer({
  storage: storage,
  fileFilter: function (
    _req: Express.Request,
    file: Express.Multer.File,
    callback: FileFilterCallback
  ) {
    if (
      file.mimetype === "image/png" ||
      file.mimetype === "image/jpg" ||
      file.mimetype === "image/jpeg"
    ) {
      callback(null, true); 
    } else {
      callback(null, false); 
    }
  },
  limits: {
    fileSize: 1024 * 1024 * 2, 
  },
});
