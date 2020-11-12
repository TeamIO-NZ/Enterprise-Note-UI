import  { createContext, useContext } from "react";

import User from "../models/User";

export type UserContextType = {
    user:User,
    setUser:(User:User) => void;
}
export const UserContext = createContext<UserContextType>({
    user: new User("","",false,"","","",0),
    setUser: (User:User)  => console.warn('No User Provider')
});

export const useUser = () => useContext(UserContext);
