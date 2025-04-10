import productService from '../service/product-service.js';

const createProduct = async (req, res, next) => {
    try {

        const body = req.body;

        if (req.file) {
            body.image_url = `/uploads/${req.file.filename}`;
        }

        const data = await productService.createProduct(req.body);
        res.status(201).json(data);
    } catch (error) {
        next(error);
    }
}

export default { createProduct };