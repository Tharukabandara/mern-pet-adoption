import asyncHandler from "express-async-handler";
import Product from "../model/Product.js";
import Category from "../model/Category.js";
import PetCategory from "../model/petCategory.js";
//@desc     Create new product
//@route    POST /api/v1/products
//@access   Private/Admin
export const createProductCtrl = asyncHandler(async (req, res)=>{
    console.log(req.files); 
    const { 
        name, 
        description,
        productCategory, 
        petCategory,  
        price, 
        totalQty, 
    } = req.body;

    //Product exists
    const productExists = await Product.findOne({ name });
    if (productExists) {
        throw new Error("Product Already Exists");
    }

    //find the product category
    const categoryFound = await Category.findOne({
        name: productCategory,
    });
    if (!categoryFound) {
        throw new Error(
            "Category not found, please create category first or check category name"
        );
    }

    //find the pet category
    const petCategoryFound = await PetCategory.findOne({
        name: petCategory?.toLowerCase(),
    });
    if (!petCategoryFound) {
        throw new Error(
            "Pet Category not found, please create pet category first or check pet category name"
        );
    }

    //create the product
    const product = await Product.create({
        name, 
        description,
        productCategory,  
        petCategory, 
        images: req.files.map(file => file.path),
        user: req.userAuthId, 
        price, 
        totalQty,
    });

    //push the product into product category
    categoryFound.products.push(product._id);
    //resave
    await categoryFound.save();

    //push the product into pet category
    petCategoryFound.products.push(product._id);
    //resave
    await petCategoryFound.save();

    //send response
    res.json({
        status: "success",
        message: "Product created successfully",
        product,
    });
});

//@desc     Get all products
//@route    Get /api/v1/products
//@access   Public 

export const getProductsCtrl = asyncHandler(async (req, res) => {
    //query
    let productQuery = Product.find();
    
    
    //search by name
    if (req.query.name) {
        productQuery = productQuery.find({
            name: { $regex: req.query.name, $options: "i"},
        });
    }

    //filter by product category
    if (req.query.productCategory) {
        productQuery = productQuery.find({
            productCategory: { $regex: req.query.productCategory, $options: "i"},
        });
    }

    //filter by pet category
    if (req.query.petCategory) {
        productQuery = productQuery.find({
            petCategory: { $regex: req.query.petCategory, $options: "i"},
        });
    }

    //filter by price range
    if (req.query.price) {
        const priceRange = req.query.price.split("-");
        //gte: greater or equal
        //lte: less or equal
        productQuery = productQuery.find({
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
    const total = await Product.countDocuments();

    productQuery = productQuery.skip(startIndex).limit(limit);

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
    const products = await productQuery;
    res.json({
        status: "success",
        total,
        results: products.length,
        pagination,
        message: "Products fetched successfully",
        products,
    });
});

//@desc     Get single product
//@route    Get /api/v1/products/:id
//@access   Public

export const getProductCtrl = asyncHandler(async(req, res)=>{
    const product = await Product.findById(req.params.id);
    if (!product) {
        throw new Error("Product not found");
    }
    res.json({
        status: "success",
        message: "Product fetched successfully",
        product,
    });
});

//@desc     Update product
//@route    PUT /api/v1/products/:id/update
//@access   Private/Admin

export const updateProductCtrl = asyncHandler(async(req, res)=>{
    const { 
        name, 
        description, 
        user, 
        productCategory, 
        petCategory, 
        sizes, 
        colors, 
        price, 
        totalQty, 
    } = req.body;

    //update
    const product = await Product.findByIdAndUpdate(req.params.id, {
        name, 
        description,
        productCategory,  
        petCategory, 
        sizes, 
        colors,
        user: req.userAuthId, 
        price, 
        totalQty,
    },
    {
        new: true,
    }
    );
   
    res.json({
        status: "success",
        message: "Product updated successfully",
        product,
    });
});

//@desc     Delete product
//@route    DELETE /api/v1/products/:id/delete
//@access   Private/Admin

export const deleteProductCtrl = asyncHandler(async(req, res)=>{
    const product = await Product.findByIdAndDelete(req.params.id);  
    res.json({
        status: "success",
        message: "Product deleted successfully",
        product,
    });
});
