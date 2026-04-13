import React, { useEffect } from "react";
import { useDispatch } from "react-redux";

import { restoreSession, finishAuthLoading } from "../store/slices/authSlice";
import { getAuth } from "../storage/authStorage";

type Props = {
  children: React.ReactNode;
};

export default function AuthBootstrap({ children }: Props) {
  const dispatch = useDispatch();

  useEffect(() => {
    async function loadAuth() {
      try {
        const data = await getAuth();

        if (data) {
          dispatch(restoreSession(data));
        } else {
          dispatch(finishAuthLoading());
        }
      } catch (error) {
        console.error("Erro ao restaurar sessão:", error);
        dispatch(finishAuthLoading());
      }
    }

    loadAuth();
  }, [dispatch]);

  return <>{children}</>;
}