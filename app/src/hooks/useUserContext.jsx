import { useContext } from "react";
import {UserContext} from "../context/userContext.jsx";

export const useUserContext = () => {
  return useContext(UserContext);
};

