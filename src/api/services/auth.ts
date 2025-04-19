import axios from "axios";
import { LoginDto, RegisterDto } from "../dto";

const API_DOMAIN = process.env.NEXT_PUBLIC_HTTP_API_DOMAIN;

export const login = async (data: LoginDto) => {
  try {
    const response = await axios.post(`${API_DOMAIN}/auth/login`, data);
    return response.data;
  } catch (error: any) {
    throw error?.response?.data || error.message;
  }
};

export const register = async (data: RegisterDto) => {
  try {
    const response = await axios.post(`${API_DOMAIN}/auth/register`, data);
    return response.data;
  } catch (error: any) {
    throw error?.response?.data || error.message;
  }
};
