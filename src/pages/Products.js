import React, { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import { createClient } from "@supabase/supabase-js";
import { Typography, Box } from "@mui/material";

export default function Products() {
  const supabaseUrl = "https://ptutxhvbmhucatlutlzd.supabase.co";
  const supabaseKey = process.env.REACT_APP_SUPABASE_API_KEY;

  const supabase = createClient(supabaseUrl, supabaseKey);

  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8); // Number of items per page

  useEffect(() => {
    async function getProducts() {
      const { data: sushiProducts, error: errorProducts } = await supabase
        .from("menu_item")
        .select(
          "menut_item_id, menu_item_name, description, availability, price",
        );

      if (errorProducts) {
        console.error("Error fetching products:", errorProducts);
      } else {
        console.log("Sushi Products:", sushiProducts);
        setProducts(sushiProducts); // Update state with the fetched products
      }
    }

    getProducts();
  }, []);

  // Pagination logic
  const totalPages = Math.ceil(products.length / itemsPerPage);

  // Slice the products for the current page
  const currentProducts = products.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  // Handle page change
  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <Box sx={{ backgroundColor: "#f4f4f4", padding: "2rem" }}>
      <Typography
        variant="h3"
        align="center"
        sx={{
          color: "#B71C1C",
          fontFamily: "'Mochiy Pop P One', sans-serif",
          marginBottom: "1.5rem",
        }}
      >
        Menu
      </Typography>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: "1rem",
        }}
      >
        {currentProducts.length > 0 ? (
          currentProducts.map((product) => (
            <Card
              key={product.menut_item_id}
              sx={{
                backgroundColor: "#ffffff",
                borderRadius: "8px",
                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                "&:hover": {
                  transform: "translateY(-10px)",
                  boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.2)",
                },
              }}
            >
              <CardHeader
                sx={{
                  backgroundColor: "#B71C1C",
                  color: "#ffffff",
                  fontFamily: "'Mochiy Pop P One', sans-serif",
                }}
                title={product.menu_item_name}
                subheader={product.description || "No description available"}
              />
              <CardContent>
                <Typography variant="body1" sx={{ color: "#757575" }}>
                  {product.availability || "No availability information"}
                </Typography>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: "bold", marginTop: "0.5rem" }}
                >
                  {`Price: $${product.price || "Not available"}`}
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: "center" }}>
                <Button
                  size="small"
                  sx={{
                    backgroundColor: "#D32F2F",
                    color: "#ffffff",
                    "&:hover": {
                      backgroundColor: "#C62828",
                    },
                  }}
                >
                  Add to Cart
                </Button>
              </CardActions>
            </Card>
          ))
        ) : (
          <Typography align="center">Loading products...</Typography>
        )}
      </Box>

      {/* Pagination controls */}
      <Box
        sx={{ display: "flex", justifyContent: "center", marginTop: "2rem" }}
      >
        <Button
          variant="contained"
          sx={{ margin: "0 1rem" }}
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        <Typography variant="body1" sx={{ alignSelf: "center" }}>
          Page {currentPage} of {totalPages}
        </Typography>
        <Button
          variant="contained"
          sx={{ margin: "0 1rem" }}
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </Box>
    </Box>
  );
}
