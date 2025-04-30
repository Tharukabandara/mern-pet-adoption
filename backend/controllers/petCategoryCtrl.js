import asyncHandler from "express-async-handler";
import PetCategory from "../model/petCategory.js";
import categoryFileUpload from "../config/categoryFileUpload.js";

//@desc     Create new pet category
//@route    POST /api/v1/petcategories
//@access   Private/Admin

export const createPetCategoryCtrl = asyncHandler(async (req, res) =>{
    const { name } = req.body;
    //pet category exists
    const petCategoryFound = await PetCategory.findOne({ name });
    if (petCategoryFound) {
        throw new Error("Pet category already exists");
    }
    //create
    const petCategory = await PetCategory.create({
        name: name.toLowerCase(),
        user: req.userAuthId,
        image: req.file.path,
    });

    res.json({
        status: "success",
        message: "Pet category created successfully",
        petCategory,
    });

});

//@desc     Get all pet categories
//@route    GET /api/v1/petcategories
//@access   Public

export const getAllPetCategoriesCtrl = asyncHandler(async (req, res) =>{
    const petCategories = await PetCategory.find();
    res.json({
        status: "success",
        message: "Fetched pet categories successfully",
        petCategories,
    });
});

//@desc     Get single pet category
//@route    GET /api/v1/petcategories/:id
//@access   Public

export const getSinglePetCategoryCtrl = asyncHandler(async (req, res) =>{
    const petCategory = await PetCategory.findById(req.params.id);
    res.json({
        status: "success",
        message: "Fetched pet category successfully",
        petCategory,
    });
});

//@desc     Update pet category
//@route    PUT /api/v1/petcategories/:id
//@access   Private/Admin

export const updatePetCategoryCtrl = asyncHandler(async(req, res)=>{
    const { name } = req.body;

    //update
    const petCategory = await PetCategory.findByIdAndUpdate(
        req.params.id, 
    {
        name,
    },
    {
        new: true,
    }
    );
   
    res.json({
        status: "success",
        message: "Pet category updated successfully",
        petCategory,
    });
});

//@desc     Delete category
//@route    DELETE /api/v1/categories/:id/delete
//@access   Private/Admin

export const deletePetCategoryCtrl = asyncHandler(async(req, res)=>{
   const petCategory = await PetCategory.findByIdAndDelete(req.params.id);  
    res.json({
        status: "success",
        message: "Pet category deleted successfully",
        petCategory,
    });
});
