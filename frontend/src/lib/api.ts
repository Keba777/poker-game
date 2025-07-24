import axios from "axios";
import { createHandInput } from "./types";

const api = axios.create({
  baseURL: "http://localhost:8000/api/v1",
});

export const createHand = async (handData: createHandInput) => {
  try {
    const response = await api.post("/hands/", handData);
    return response.data;
  } catch (error) {
    console.error("Error creating hand:", error);
    throw error;
  }
};

export const getHands = async () => {
  const response = await api.get("/hands/");
  return response.data;
};