import http from "./HttpCommon";

class UserDataService {
  getAll() {
    return http.get("/users");
  }
  get(id: number) {
    return http.get(`/users/${id}`);
  }
  getByName(name: string) {
    return http.get(`/users/${name}`);
  }
  getByEmail(email: string) {
    return http.get(`/users/${email}`);
  }
  create(data: any) {
    return http.post("/user", data);
  }

  update(id: number, data: any) {
    return http.put(`/user/${id}`, data);
  }

  delete(id: number) {
    return http.delete(`/user/${id}`);
  }

  //   deleteAll() {
  //     return http.delete(`/tutorials`);
  //   }

  login(username: string, password: string) {
    return http.get(`/login/${username}/${password}`);
  }
}
export default new UserDataService();