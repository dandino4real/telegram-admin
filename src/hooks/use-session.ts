
// src/hooks/use-session.ts
"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { RootState, AppDispatch } from "@/store";
import { setSession, clearSession } from "@/store/sessionStore";
import { setAccessToken, getAccessToken } from "@/lib/authManager";
import { useValidateTokenQuery } from "@/store/api";
import { ApiError } from "@/store/type";

export interface Session {
  adminId: string | null;
  isLoggedIn: boolean;
  isRestoring: boolean;
}

export const useSession = (): Session => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { refreshToken, user } = useSelector(
    (state: RootState) => state.authSession
  );
  const [isRestoring, setIsRestoring] = useState(true);

  const { data, error, isLoading } = useValidateTokenQuery(undefined, {
    skip: !refreshToken || !user?.id || !!getAccessToken(),
  });

  useEffect(() => {
    const restoreSession = async () => {
    

      if (refreshToken && user?.id) {
        if (!getAccessToken()) {
          if (isLoading) {
            return;
          }
          if (data?.message === "Valid token") {
            try {
              const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/auth/refresh-token`,
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    "x-refresh-token": refreshToken,
                  },
                  body: JSON.stringify({ refreshToken }),
                }
              );


              if (!response.ok) {
                const errorData: ApiError = await response.json();
                throw new Error(
                  `HTTP error! status: ${response.status}, message: ${errorData.message}`
                );
              }

              const responseData = await response.json();
          

              if (responseData.accessToken && responseData.id) {
                setAccessToken(responseData.accessToken);
                dispatch(
                  setSession({
                    refreshToken: responseData.refreshToken || refreshToken,
                    user: { id: responseData.id },
                  })
                );
              } else {
                throw new Error("Invalid refresh token response");
              }
            } catch (err: unknown) {
              if (err instanceof Error) {
                console.log(
                  "useSession: Session restoration failed:",
                  err.message
                );
              } else {
                console.log("useSession: Session restoration failed:", err);
              }

              dispatch(clearSession());
              setAccessToken(null);
              router.push("/login");
            }
          } else if (error) {
            console.log(
              "useSession: Token validation failed:",
              (error as { data?: ApiError }).data?.message || error
            );
            dispatch(clearSession());
            setAccessToken(null);
            router.push("/login");
          }
        } else {
          console.log(
            "useSession: Valid session with accessToken, no action needed"
          );
        }
      } else {
        console.log("useSession: No valid session, redirecting to /login");
        dispatch(clearSession());
        setAccessToken(null);
        if (
          !["/login", "/forgot", "/otp", "/reset"].includes(
            window.location.pathname
          )
        ) {
          router.push("/login");
        }
      }

      setIsRestoring(false);
    };

    restoreSession();
  }, [dispatch, router, refreshToken, user, data, error, isLoading]);

  const sessionState = {
    adminId: user?.id || null,
    isLoggedIn: !!refreshToken && !!user?.id && !!getAccessToken(),
    isRestoring,
  };

  return sessionState;
};
