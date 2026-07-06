import api from "./api";

const products = async () => {
  const response = await api.get("product");
  return response.data;
};

export { products };
