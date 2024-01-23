import axiosClient from "./Main";
const SCHEMA = "oder";
class OderFireBaseService {
  getAll() {
    const url = `${SCHEMA}.json`;
    return axiosClient.get(url);
  }
    update(data) {
     
    const url = `/${SCHEMA}/${data.id}.json`;
    return axiosClient.patch(url, data);
  }
  getbyId(id) {
    
  const url = `/${SCHEMA}/${id}.json`;
  return axiosClient.get(url);
}
  delete(data) {
   
  const url = `/${SCHEMA}//${data.id}.json`;
  return axiosClient.delete(url, data);
}
}

export default new OderFireBaseService();