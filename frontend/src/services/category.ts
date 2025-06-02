import api from "@/api";
import getTokenHeader from "@/utils/getTokenHeader";
import { handleApiError } from "@/utils/handleApiError";

export const fetchAllCategories = async () => {
  try {
    const res = await api.get("/category", {
      headers: getTokenHeader(),
    });

    return res.data;
  } catch (error) {
    handleApiError(error, "Failed to fetch categories");
  }
};

export const fetchCategoryById = async (id: number) => {
  try {
    const res = await api.get(`/category/${id}`, {
      headers: getTokenHeader(),
    });

    return res.data;
  } catch (error) {
    handleApiError(error, "Failed to fetch category");
  }
};

export const createCategory = async (data: {
  name: string;
  description?: string;
}) => {
  try {
    const res = await api.post(`/category/`, data, {
      headers: getTokenHeader(),
    });

    return res.data;
  } catch (error) {
    handleApiError(error, "Failed to create categories");
  }
};

export const updateCategory = async (
  id: number,
  data: {
    name: string;
    description?: string;
  }
) => {
  try {
    const res = await api.put(`/category/${id}`, data, {
      headers: getTokenHeader(),
    });

    return res.data;
  } catch (error) {
    handleApiError(error, "Failed to update categories");
  }
};

export const deleteCategory = async (id: number) => {
  try {
    const res = await api.delete(`/category/${id}`, {
      headers: getTokenHeader(),
    });

    return res.data;
  } catch (error) {
    handleApiError(error, "Failed to delete categories");
  }
};
