import axios from "axios";

const API_URI = "http://localhost:8000";

export const registering = async (data) => {
  try {
    const response = await axios.post(`${API_URI}/register`, data);
    return response.status;
  } catch (error) {
    return error.response.status;
  }
};

export const logging = async (data) => {
  try {
    const response = await axios.post(`${API_URI}/login`, data);
    return response.status;
  } catch (error) {
    return error.response.status;
  }
};
