import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchCategoriesAction } from "../../redux/slices/categories/categoriesSlice";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import ButtonBase from "@mui/material/ButtonBase";
import Typography from "@mui/material/Typography";

const ImageButton = styled(ButtonBase)(({ theme }) => ({
  position: "relative",
  height: 280,
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

const HomeCategories = () => {
  const dispatch = useDispatch();
  const { categories, loading, error } = useSelector((state) => state.categories);
  const categoriesArray = categories?.categories ?? [];

  useEffect(() => {
    dispatch(fetchCategoriesAction());
  }, [dispatch]);

  const categoriesToShow = categoriesArray.slice(0, 5);

  if (loading) return <p className="text-center py-4">Loading categories...</p>;
  if (error) return <p className="text-center py-4 text-red-500">{error.message}</p>;

  return (
    <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "center", width: "100%", mt: 4 }}>
      {categoriesToShow.map((category) => (
        <Link
          key={category.name}
          to={`/products?category=${encodeURIComponent(category.name)}`}
          style={{ width: "19%", margin: "0.5%" }}
        >
          <ImageButton focusRipple sx={{ width: "100%" }}>
            <ImageSrc style={{ backgroundImage: `url(${category.image})` }} />
            <ImageBackdrop className="MuiImageBackdrop-root" />
            <Image>
              <Typography
                component="span"
                variant="h6"
                color="inherit"
                sx={{
                  position: "relative",
                  px: 2,
                  fontWeight: "bold",
                  fontSize: "1.2rem",
                  textAlign: "center",
                }}
              >
                {category.name} ({category.products?.length || 0})
              </Typography>
            </Image>
          </ImageButton>
        </Link>
      ))}
    </Box>
  );
};

export default HomeCategories;
