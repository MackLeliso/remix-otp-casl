import { Box, Typography } from "@mui/material";
import { Link } from "@remix-run/react";

// product  list component
export default function Product({ products }: any) {
  return (
    <Box mt={3} display="flex" flexWrap="wrap" position="relative">
      {products?.map((product: any) => (
        <Box bgcolor="white" borderRadius={2} width="250px" m={2}>
          <Typography p={1} variant="h4">
            {product?.name}
          </Typography>
          <Typography p={1}>{product?.description}</Typography>
          <Link style={{ textDecoration: "none" }} to={product.id}>
            <Typography p={1}>view more</Typography>
          </Link>
        </Box>
      ))}
    </Box>
  );
}
