import { serverApi } from "./serverApi";

const products = async (URL: string, page = 1, limit = 10) => {
  const response = await serverApi(`${URL}?page=${page}&limit=${limit}`);
  return response;
};

export { products };
