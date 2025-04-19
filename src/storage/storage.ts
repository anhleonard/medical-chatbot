import { ACCESS_TOKEN } from "./constants";

export const setAccessToken = (token: string): void => {
  localStorage.setItem(ACCESS_TOKEN, token);
};

export const getAccessToken = (): string | null => {
  return localStorage.getItem(ACCESS_TOKEN);
};

export const removeAccessToken = (): void => {
  localStorage.removeItem(ACCESS_TOKEN);
};
