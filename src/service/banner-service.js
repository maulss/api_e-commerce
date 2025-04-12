import { v4 as uuid } from "uuid";
import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";
import { createBannerValidation } from "../validation/banner-validation.js";
import { validate } from "../validation/validation.js";

const createBanner = async (body) => {
    const banner = validate(createBannerValidation, body);

    const existingBanner = await prismaClient.banner.findFirst({
        where: { title: banner.title },
    });

    if (existingBanner) {
        throw new ResponseError(400, "Banner already exists");
    }

    const newBanner = await prismaClient.banner.create({
        data: {
            banner_id: uuid(),
            title: banner.title,
            image_url: banner.image_url,
            created_by: banner.created_by,
        },
        select: {
            banner_id: true,
            title: true,
            image_url: true,
            created_by: true,
        },
    });

    return {
        success: true,
        message: "Banner created successfully",
        data: newBanner,
    };
};

const getAllBanners = async () => {
    try {
        const banners = await prismaClient.banner.findMany();

        return {
            success: true,
            message: "Banners retrieved successfully",
            data: banners,
        };
    } catch (error) {
        throw new ResponseError(500, "Failed to retrieve banners");
    }
};

const updateBanner = async (id, body) => {
    const banner = await prismaClient.banner.findUnique({
        where: { banner_id: id },
    });

    if (!banner) {
        throw new ResponseError(404, "Banner not found");
    }

    let imageUrl = banner.image_url;

    if (body.image_url) {
        imageUrl = `/uploads/${body.image_url}`;
    }

    const updatedBanner = await prismaClient.banner.update({
        where: { banner_id: id },
        data: {
            title: body.title || banner.title,
            image_url: imageUrl,
            created_by: body.created_by || banner.created_by,
        },
    });

    return {
        success: true,
        message: "Banner updated successfully",
        data: updatedBanner,
    };
};

const deleteBanner = async (id) => {
    const banner = await prismaClient.banner.findUnique({
        where: { banner_id: id },
    });

    if (!banner) {
        throw new ResponseError(404, "Banner not found");
    }

    await prismaClient.banner.delete({
        where: { banner_id: id },
    });

    return {
        success: true,
        message: "Banner deleted successfully",
    };
};

export default { createBanner, getAllBanners, updateBanner, deleteBanner };