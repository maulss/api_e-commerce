import categoryService from "../service/category-service.js";

const createCategory = async (req, res, next) => {
    try {
        const body = req.body;
        const data = await categoryService.createCategory(body);
        res.status(201).json(data);

    } catch (error) {
        next(error);
    }
}

const getListCategory = async (req, res, next) => {
    try {
        const data = await categoryService.getListCategory(req.query);
        res.status(200).json(data);
    } catch (error) {
        next(error);
    }
}

const updateCategory = async (req, res, next) => {
    try {
        const categoryId = req.params.categoryId;
        const body = req.body;
        const result = await categoryService.updateCategory(categoryId, body);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}

export default {
    createCategory, getListCategory, updateCategory
}