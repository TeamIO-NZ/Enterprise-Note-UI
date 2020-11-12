import http from "./HttpCommon";

class UserDataService {
  getAll() {
    return http.get("/users");
  }
  get(id: number) {
    return http.get(`/user/${id}`);
  }
  getByName(name: string) {
    return http.get(`/user/name/${name}`);
  }
  getByEmail(email: string) {
    return http.get(`/user/email/${email}`);
  }
  create(data: any) {
    console.log("Create me:")
    console.log(data);
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
  async getData() {
    console.log("Getting Data");
    return await this.getAll().then(response => {
      console.log(response);
        return response.data;
    });
  };
}
export default new UserDataService();