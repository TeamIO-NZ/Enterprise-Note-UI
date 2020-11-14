import http from "./HttpCommon";


class UserSettingsDataService {
 
  get(id: number) {
    return http.get(`/usersettings/${id}`);
  }
  create(data: any) {
    return http.post("/usersettings", data);
  }

  update(id: number, data: any, uId: number) {
    return http.put(`/usersettings/${id}`, data);
  }

  delete(id: number) {
    console.log("Deleting note");
    return http.delete(`/usersettings/${id}`);
  }
  
}
export default new UserSettingsDataService();