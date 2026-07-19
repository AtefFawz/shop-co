import { serverApi } from "./serverApi";

const products = async () => {
  const response = await serverApi("product");

  return response.data.Products;
};

export { products };
