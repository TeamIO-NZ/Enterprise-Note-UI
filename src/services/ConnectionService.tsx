import http from './HttpCommon'

class ConnectionService {
    get() {
        return http.get("/");
    }
}

export default new ConnectionService();