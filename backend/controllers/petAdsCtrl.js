import asyncHandler from "express-async-handler";
import PetCategory from "../model/petCategory.js";
import PetAd from "../model/PetAd.js";

//@desc     Create new Pet Ad
//@route    POST /api/v1/petAds
//@access   Public

export const createPetAdCtrl = asyncHandler(async (req, res)=>{ 
    const { 
        title, 
        description,
        petCategory,  
        location,
        phone,
        price, 
    } = req.body;


    //find the pet category
    const petCategoryFound = await PetCategory.findOne({
        name: petCategory?.toLowerCase(),
    });
    if (!petCategoryFound) {
        throw new Error(
            "Pet Category not found, please create pet category first or check pet category name"
        );
    }

    //create the pet ad
    const petAd = await PetAd.create({
        title, 
        description,  
        petCategory, 
        images: req.files.map(file => file.path),
        user: req.userAuthId, 
        price,
        phone,
        location,
    });

    //push the pet ad into pet category
    petCategoryFound.petAds.push(petAd._id);
    //resave
    await petCategoryFound.save();

    //send response
    res.json({
        status: "success",
        message: "Pet Ad created successfully",
        petAd,
    });
});

//@desc     Get all pet ads
//@route    Get /api/v1/petAds
//@access   Public 

export const getPetAdsCtrl = asyncHandler(async (req, res) => {
    //query
    let petAdQuery = PetAd.find();
    
    
    //search by title
    if (req.query.title) {
        petAdQuery = petAdQuery.find({
            title: { $regex: req.query.title, $options: "i"},
        });
    }


    //filter by pet category
    if (req.query.petCategory) {
        petAdQuery = petAdQuery.find({
            petCategory: { $regex: req.query.petCategory, $options: "i"},
        });
    }

    //filter by price range
    if (req.query.price) {
        const priceRange = req.query.price.split("-");
        //gte: greater or equal
        //lte: less or equal
        petAdQuery = petAdQuery.find({
            price: { $gte: priceRange[0], $lte: priceRange[1] },
        });
    }

    //pagination
    //page
    const page = parseInt(req.query.page) ? parseInt(req.query.page) : 1;
    //limit
    const limit = parseInt(req.query.limit) ? parseInt(req.query.limit) : 10;
    //startIdx
    const startIndex = (page - 1) * limit;
    //endIdx
    const endIndex = page * limit;
    //total
    const total = await PetAd.countDocuments();

    petAdQuery = petAdQuery.skip(startIndex).limit(limit);

    //pagination results
    const pagination = {};
    if (endIndex < total) {
        pagination.next = {
            page: page + 1,
            limit,
        };
    }
    if (startIndex > 0) {
        pagination.prev = {
            page: page - 1,
            limit,
        }
    }

    //await the query
    const petAds = await petAdQuery;
    res.json({
        status: "success",
        total,
        results: petAds.length,
        pagination,
        message: "Pet Ads fetched successfully",
        petAds,
    });
});

//@desc     Get single pet ad
//@route    Get /api/v1/petAd/:id
//@access   Public

export const getPetAdCtrl = asyncHandler(async(req, res)=>{
    const petAd = await PetAd.findById(req.params.id);
    if (!petAd) {
        throw new Error("Pet Ad not found");
    }
    res.json({
        status: "success",
        message: "PetAd fetched successfully",
        petAd,
    });
});


//@desc     Delete pet ad
//@route    DELETE /api/v1/petAds/:id/delete
//@access   Public

export const deletePetAdCtrl = asyncHandler(async(req, res)=>{
    const petAd = await PetAd.findByIdAndDelete(req.params.id);  
    res.json({
        status: "success",
        message: "PetAd deleted successfully",
        petAd,
    });
});
