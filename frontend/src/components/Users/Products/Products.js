import React from "react";
import { Link } from "react-router-dom";
import Button from '@mui/material/Button';


const Products = ({ products }) => {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products?.map((product) => (
        <div
          key={product._id}
          className="border rounded-lg overflow-hidden shadow hover:shadow-md transition"
        >
          <div className="relative bg-gray-50">
            <Link to={`/products/${product._id}`} className="block">
              <img
                className="w-full h-48 object-cover"
                src={product?.images?.[0]}
                alt={product?.name}
              />
            </Link>
            <div className="px-6 pb-6 mt-8">
              <div className="block px-6 mb-2">
                <h3 className="mb-2 text-xl font-bold font-heading">
                  {product?.name}
                </h3>
                <p className="text-lg font-bold font-heading text-blue-500">
                  <span>Rs.{product?.price}</span>
                </p>
              </div>
              <Button variant="contained" 
              onClick={() => alert("Add to cart coming soon!")}
              >Add to cart
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Products;
