// import { ResponseError } from "../error/response-error.js";

// const errorMiddleware = async (err, req, res, next) => {
//     if (!err) {
//         next();
//         return;
//     }

//     if (err instanceof ResponseError) {
//         res.status(err.status).json({
//             errors: err.message
//         }).end();
//     } else {

//         res.status(500).json({
//             errors: err.message
//         }).end();

//     }
// };

// export { errorMiddleware }

import { ResponseError } from "../error/response-error.js";

const errorMiddleware = (err, req, res, next) => {
    if (!err) {
        next();
        return
    }

    console.error("Error Middleware:", err);

    if (err instanceof ResponseError) {
        return res.status(err.status).json({
            success: false,
            message: err.message
        });
    }

    return res.status(500).json({
        success: false,
        message: "Internal Server Error"
    });
};

export { errorMiddleware };