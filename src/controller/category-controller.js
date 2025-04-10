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

export default {
    createCategory
}