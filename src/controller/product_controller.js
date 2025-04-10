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

const getListProduct = async (req, res, next) => {
    try {
        const data = await productService.getListProduct(req.query);
        res.status(200).json(data);
    } catch (error) {
        next(error);
    }
}

const getProductById = async (req, res, next) => {
    try {
        const productId = req.params.productId;
        const result = await productService.getProductById(productId);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

const updateProduct = async (req, res, next) => {
    try {
        const productId = req.params.productId;
        const body = req.body;
        if (req.file) {
            body.image_url = `/uploads/${req.file.filename}`;
        }
        const result = await productService.updateProduct(productId, req.body);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

const deleteProduct = async (req, res, next) => {
    try {
        const productId = req.params.productId;
        const result = await productService.deleteProduct(productId);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};



export default { createProduct, getListProduct, getProductById, updateProduct, deleteProduct };