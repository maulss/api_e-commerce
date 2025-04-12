import bannerService from "../service/banner-service.js";

const createBanner = async (req, res, next) => {
    try {
        const body = req.body;


        if (req.file) {
            body.image_url = `/uploads/${req.file.filename}`;
        }

        const data = await bannerService.createBanner(body);
        res.status(201).json(data);
    } catch (e) {
        next(e);
    }
};

const getAllBanners = async (req, res, next) => {
    try {
        const data = await bannerService.getAllBanners();
        res.status(200).json(data);
    } catch (e) {
        next(e);
    }
};

const updateBanner = async (req, res, next) => {
    try {
        const { id } = req.params;
        const body = req.body;

        if (req.file) {
            body.image_url = req.file.filename;
        }

        const data = await bannerService.updateBanner(id, body);
        res.status(200).json(data);
    } catch (e) {
        next(e);
    }
};

const deleteBanner = async (req, res, next) => {
    try {
        const { id } = req.params;

        const data = await bannerService.deleteBanner(id);
        res.status(200).json(data);
    } catch (e) {
        next(e);
    }
};




export default {
    createBanner,
    getAllBanners,
    updateBanner,
    deleteBanner,
};