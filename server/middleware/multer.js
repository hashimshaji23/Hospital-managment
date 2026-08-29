import multer from 'multer';
import path from "path";
import fs from 'fs';

const uplodDir = "uploads";
if (!fs.existsSync(uplodDir)) {
    fs.mkdirSync(uplodDir);
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uplodDir)
    },

    filename: function (req, file, cb) {
        const uniqeName = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(
            null, uniqeName + path.extname(file.originalname)
        )
    },

});

const fileFilter = (req, file, cb) => {
    if (
        file.mimetype === "image/png" ||
        file.mimetype === "image/jpg" ||
        file.mimetype === "image/jpeg" ||
        file.mimetype === "image/webp"
    ) {
        cb(null, true);

    } else {
        cb(new Error("only image files are allowed"), false);
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5mb
    },
});

export default upload;