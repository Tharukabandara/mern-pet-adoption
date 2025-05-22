import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductsAction } from "../../redux/slices/products/productSlices";
import { Link } from "react-router-dom";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import ButtonBase from "@mui/material/ButtonBase";
import Typography from "@mui/material/Typography";

const ImageButton = styled(ButtonBase)(({ theme }) => ({
  position: "relative",
  height: 300,
  borderRadius: "16px",
  overflow: "hidden",
  [theme.breakpoints.down("sm")]: {
    width: "100% !important",
    height: 140,
  },
  "&:hover, &.Mui-focusVisible": {
    zIndex: 1,
    "& .MuiImageBackdrop-root": {
      opacity: 0.15,
    },
    "& .MuiImageMarked-root": {
      display: "none",
    },
  },
}));

const ImageSrc = styled("span")({
  position: "absolute",
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  backgroundSize: "cover",
  backgroundPosition: "center 40%",
});

const Image = styled("span")(({ theme }) => ({
  position: "absolute",
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: theme.palette.common.white,
}));

const ImageBackdrop = styled("span")(({ theme }) => ({
  position: "absolute",
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  backgroundColor: theme.palette.common.black,
  opacity: 0.4,
  transition: theme.transitions.create("opacity"),
}));

const HomeProductTrending = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProductsAction());
  }, [dispatch]);

  const trendingProducts = products?.slice(0, 4);

  return (
    <section aria-labelledby="trending-heading">
      <div className="mx-auto max-w-7xl py-24 px-4 sm:px-6 sm:py-32 lg:px-8 lg:pt-32">
        <div className="md:flex md:items-center md:justify-between">
          <h2 id="favorites-heading" className="text-2xl font-bold tracking-tight text-gray-900">
            Pet Accessories
          </h2>
          <Link
            to="/products"
            className="hidden text-sm font-medium text-indigo-600 hover:text-indigo-500 md:block"
          >
            Shop the accessories <span aria-hidden="true"> &rarr;</span>
          </Link>
        </div>

        {loading && <p>Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}

        <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "center", width: "100%", mt: 4 }}>
          {trendingProducts?.map((product) => (
            <Link
              to={`/products/${product._id}`}
              key={product._id}
              style={{ width: "23%", margin: "1%" }}
            >
              <ImageButton focusRipple sx={{ width: "100%" }}>
                <ImageSrc
                  style={{
                    backgroundImage: `url(${product?.images?.[0] || "https://via.placeholder.com/300"})`,
                  }}
                />
                <ImageBackdrop className="MuiImageBackdrop-root" />
                <Image>
                  <Typography
                    component="span"
                    variant="h6"
                    color="inherit"
                    sx={{
                      position: "relative",
                      fontWeight: "bold",
                      fontSize: "1.2rem",
                      textAlign: "center",
                      px: 2,
                    }}
                  >
                    {product.name}
                  </Typography>
                </Image>
              </ImageButton>
              <Typography
                variant="body1"
                className="text-center mt-2"
                sx={{ fontWeight: 600, fontSize: "1rem", color: "#333" }}
              >
                Rs.{product.price}
              </Typography>
            </Link>
          ))}
        </Box>
      </div>
    </section>
  );
};

export default HomeProductTrending;
