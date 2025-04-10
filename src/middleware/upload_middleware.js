import multer from "multer";
import path from "path";
import fs from "fs";

// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         const dir = "./uploads/";

//         if (!fs.existsSync(dir)) {
//             fs.mkdirSync(dir, { recursive: true });
//         }

//         cb(null, dir);
//     },
//     filename: (req, file, cb) => {
//         cb(null, "profile_" + Date.now() + path.extname(file.originalname));
//     },
// });

// export const upload = multer({ storage });

export const uploadWithPrefix = (prefix = "file") => {
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            const dir = "./uploads/";

            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }

            cb(null, dir);
        },
        filename: (req, file, cb) => {
            cb(null, `${prefix}_${Date.now()}${path.extname(file.originalname)}`);
        },
    });

    return multer({ storage });
};