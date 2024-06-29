import axios from "axios";

const API_URI = "http://localhost:8000";

export const registering = async (data) => {
  try {
    const form={
      firstname: data.firstname,
      lastname: data.lastname,
      username: data.username,
      email: data.email,
      password: data.password,
      key: "a",
    };
    const response = await axios.post(`${API_URI}/api/auth/signup`, form);
    console.log("response:",response);
    return response.data.message;
  } catch (error) {
    console.log(error.response.data.error);
    return error.response.data.error;
  }
};

export const logging = async (data) => {
  try {
    const form={
      username: data.username,
      password: data.password,
    };
    const response = await axios.post(`${API_URI}/api/auth/login`, form);
    return response.data.message;
  } catch (error) {
    return error.response.data.error;
  }
};

export const probleming = async (data) => {
  try {
    console.log("data", data);
    const response = await axios.post(`${API_URI}/api/prob/problemset`, {
      page: data,
    });
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export const problem_calling = async (slug) => {
  try {
    const response = await axios.get(`${API_URI}/api/prob/problem/${slug}`);
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
