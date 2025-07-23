import axios from "axios";
import { createHandInput } from "./types";

const api = axios.create({
  baseURL: "http://localhost:8000/api/v1",
});

export const createHand = async (handData : createHandInput) => {
  const response = await api.post("/hands/", handData);
  return response.data;
};

export const getHands = async () => {
  const response = await api.get("/hands/");
  return response.data;
};
