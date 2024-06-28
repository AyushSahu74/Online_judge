import axios from "axios";

const API_URI = "http://localhost:8000";

export const registering = async (data) => {
  try {
    const response = await axios.post(`${API_URI}/register`, data);
    return response.data.message;
  } catch (error) {
    return error.response.data.message;
  }
};

export const logging = async (data) => {
  try {
    const response = await axios.post(`${API_URI}/login`, data);
    return response.data;
  } catch (error) {
    return error.response.data.message;
  }
};

export const probleming = async (data) => {
  try {
    const response = await axios.get(`${API_URI}/problemset`, data);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export const problem_calling = async (slug) => {
  try {
    const response = await axios.get(`${API_URI}/problem/${slug}`);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export const user_finding = async () => {
  try {
    const response = await axios.get(`${API_URI}/user_info`);
    return response.data;
  } catch (error) {
    console.log(error.message);
    return error.response.data;
  }
};
