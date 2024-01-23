import axiosClient from "./Main";
const SCHEMA = "product";
class roleService {
    getAllfirebase() {
        const url = `${SCHEMA}.json`;
        return axiosClient.get(url);
        }
        getbyday(date) {
            const url = `${SCHEMA}/${date}.json`;
            return axiosClient.get(url);
          }
        update(data) {
          console.log(data)
        const url = `/${SCHEMA}/${data.productID}.json`;
        return axiosClient.patch(url, data);
      }
   

}

export default new roleService();