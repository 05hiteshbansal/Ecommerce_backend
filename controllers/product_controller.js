const bigpromise = require("../middleware/big_promise");
const Product = require("../models/product");
const cloudinary = require("cloudinary");
const CustomError = require("../utils/coustom_error");
const WhereClause = require("../utils/whereClause");
const { query } = require("express");

exports.test = bigpromise(async (req, res) => {
  res.status(200).json({
    success: true,
    done: "Test",
  });
});

exports.addProduct = bigpromise(async (req, res, next) => {
  // images;

  let imagesArray = [];

  if (!req.files) {
    return next(new CustomError("Images are require", 402));
  }

  //console.log(req.files.photos)

  let result = await cloudinary.v2.uploader.upload(
    req.files.photos.tempFilePath,
    {
      // abi ek hi photo hai jo add ho rahai hai
      folder: "products",
    }
  );

  console.log(imagesArray);
  imagesArray.push({
    id: result.public_id,
    secure_url: result.secure_url,
  });
  console.log(imagesArray);

  // console.log(imagesArray)
  req.body.photos = imagesArray;
  const product = await Product.create(req.body);
  res.status(200).json({
    success: true,
    product,
  });
});

exports.getProduct = bigpromise(async (req, res, next) => {
  const resultPerPage = 6;
  const totalCountProduct = await Product.countDocuments();
  let productsObj = new WhereClause(Product.find(), req.query)
    .search()
    .filter();

  let products = await productsObj.base;

  const filteredProductNo = products.length;
  productsObj.pager(resultPerPage);
  products = await productsObj.base.clone();

  // const products = Product.find({})

  res.status(200).json({
    success: true,
    products,
    filteredProductNo,
    totalCountProduct,
  });
});

exports.adminGetAllProducts = bigpromise(async (req, res, next) => {
  const products = await Product.find();
  res.status(200).json({
    success: true,
    products,
  });
});

exports.GetOneProduct = bigpromise(async (req, res, next) => {
  const product = await Product.findOne({ _id: req.params.id });
  if (!product) {
    return next(new CustomError("No product find with this id", 401));
  }

  res.status(200).json({
    success: true,
    product,
  });
});

exports.AdminUpdateOneProduct = bigpromise(async (req, res, next) => {
  const product = await Product.findOne({ _id: req.params.id });
  if (!product) {
    return next(new CustomError("No product find with this id", 401));
  }

  if (req.files) {
    // delete existing images

    for (let index = 0; index < product.photos.length; index++) {
      const res = await cloudinary.v2.uploader.destroy(
        product.photos[index].id
      );
    }
    let imagesArray = [];

    let result = await cloudinary.v2.uploader.upload(
      req.files.photos.tempFilePath,
      {
        // abi ek hi photo hai jo add ho rahai hai
        folder: "products",
      }
    );

    console.log(imagesArray, 2);
    imagesArray.push({
      id: result.public_id,
      secure_url: result.secure_url,
    });
    console.log(imagesArray, 3);

    // console.log(imagesArray)
    req.body.photos = imagesArray;
  }

  const updatedItem = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    success: true,
    updatedItem,
  });
});

exports.AdminDeleteOneProduct = bigpromise(async (req, res, next) => {
  const product = await Product.findOne({ _id: req.params.id });
  if (!product) {
    return next(new CustomError("No product find with this id", 401));
  }

  for (let index = 0; index < product.photos.length; index++) {
    await cloudinary.v2.uploader.destroy(product.photos[index].id);
  }

  await Product.deleteOne({ _id: req.params.id });

  res.status(200).json({
    success: true,
    message: "deleted Successfuly",
  });
});

exports.addReview = bigpromise(async (req, res, next) => {
  const { rating, comment, productId } = req.body;

  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };

  const product = await Product.findById(productId);

  const AlreadyReview = product.reviews.find(
    (rev) => rev.user.toString() === req.user._id.toString()
  );
  if (AlreadyReview) {
    product.reviews.forEach((r) => {
      r.comment = comment;
      r.rating = rating;
    });
  } else {
    product.reviews.push(review);
    product.numberReviews = product.reviews.length;
  }

  // adjust rating

  product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0)/
  product.reviews.length;

  // save

  await product.save({ validateBeforeSave: false });

  res.status(200).json({
    success: "true",
  });
});

exports.deleteReview = bigpromise(async (req, res, next) => {
  const { productId } = req.query;
  const product = await Product.findById(productId);

  const Reviews = product.reviews.filter(
    (rev) => rev.user.toString() === req.user._id.toString()
  );
  
const numberReviews = Reviews.length
  // adjust rating

  product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0)/product.reviews.length;

  // save

  await product.findByIdAndUpdate( productId ,{ 
    Reviews,
    rating,
    numberReviews
   },{
    new :true,
    runValidators: true 
   });

  res.status(200).json({
    success: "true",
  });
});

exports.allReview = bigpromise(async(req,res,next)=>{
    const product = await Product.findById(req.query.id)

    res.status(200).json({
        message: "Success",
        reviews : product.reviews
    })
})
