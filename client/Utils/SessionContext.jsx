import React, { createContext, useContext, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setSessionExpired } from "../src/state/index"; 
import { createApiClient } from "./Utils"; 

const SessionContext = createContext();

export const SessionProvider = ({ children }) => {
  const dispatch = useDispatch();
  const isSessionExpired = useSelector((state) => state.auth.isSessionExpired);

  const apiClient = useMemo(() => createApiClient(dispatch), [dispatch]);

  const showSessionExpiredPopup = () => {
    dispatch(setSessionExpired(true));
  };

  const closeSessionPopup = () => {
    dispatch(setSessionExpired(false));
    window.location.href = "/login"; 
  };

  return (
    <SessionContext.Provider
      value={{ isSessionExpired, showSessionExpiredPopup, closeSessionPopup, apiClient }}
    >
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => useContext(SessionContext);
