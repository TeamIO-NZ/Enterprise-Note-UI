import http from "./HttpCommon";


class NoteDataService {
  getAll() {
    return http.get("/notes");
  }
  getAllUserHasAccessTo(id: number) {
    return http.get(`/usersnotes/${id}`)
  }
  get(id: number) {
    return http.get(`/note/${id}`);
  }
  create(data: any) {
    return http.post("/note", data);
  }

  update(id: number, data: any, uId: number) {
    return http.put(`/note/${id}/${uId}`, data);
  }

  delete(id: number) {
    console.log("Deleting note");
    return http.delete(`/note/${id}`);
  }

  //   deleteAll() {
  //     return http.delete(`/tutorials`);
  //   }

  // getSpecific(username: string, password: string) {
  //   return http.get(`/login/${username}/${password}`);
  // }
  async getData(userId: number) {
    //console.log("Getting Data");
    return await this.getAllUserHasAccessTo(userId).then(response => {
        return response.data;
    });
  };
}
export default new NoteDataService();