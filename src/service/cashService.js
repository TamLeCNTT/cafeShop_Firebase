import { db } from "../config/firebase";
import { set, ref, onValue, remove } from "firebase/database";
import axios from "axios";
import axiosClient from "./Main";
const SCHEMA = "cash";
class cashService {
  getAll() {
    const url = `${SCHEMA}.json`;
    return axiosClient.get(url);
    }
    getbyday(date) {
        const url = `${SCHEMA}/${date}.json`;
        return axiosClient.get(url);
      }
    update(data) {
      console.log(data)
    const url = `/${SCHEMA}/${data.date}/${data.id}.json`;
    return axiosClient.patch(url, data);
  }
  delete(data) {
  
  const url = `/${SCHEMA}/${data.id}.json`;
  return axiosClient.delete(url, data);
}
}

export default new cashService();