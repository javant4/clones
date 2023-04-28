import { Session, User } from "@supabase/supabase-js";
import { profile } from "console";
import { useEffect, useState, createContext, useContext } from "react";
import { getURL } from "./helpers";
import { supabase } from "./supabaseClient";

type UserContextType = {
  user?: User;
  emailPasswordSignUp: (
    email: string,
    username: string,
    password: string
  ) => Promise<void>;
  emailPasswordLogin: (email: string, password: string) => Promise<void>;
  googleLogin: () => Promise<void>;
  logout: () => Promise<void>;
  resetPasswordFromEmail: (email: string) => Promise<void>;
  error?: string;
  loadingUser?: boolean;
};

export const UserContext = createContext<UserContextType | undefined>(
  undefined
);

export interface Props {
  [propName: string]: any;
}

export const MyUserContextProvider = (props: Props) => {
  const [user, setUser] = useState<User>();
  const [error, setError] = useState<string>();
  const [loadingUser, setLoadingUser] = useState<boolean>();

  const updateUserPassword = async (newPassword: string | null) => {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword as string | undefined,
    });

    if (data) alert("Password updated successfully!");
    if (error) alert("There was an error updating your password.");
  };

  useEffect(() => {
    if (user) return;
    setLoadingUser(true);
    supabase.auth.getSession().then((data) => {
      return setUser(data.data.session?.user);
    });
    setLoadingUser(false);
  }, []);

  useEffect(() => {
    supabase.auth.onAuthStateChange(async (event, session) => {
      setLoadingUser(true);
      if (session) setUser(session.user);

      if (event == "PASSWORD_RECOVERY") {
        const newPassword = prompt(
          "What would you like your new password to be?"
        );

        updateUserPassword(newPassword);
      }
      setLoadingUser(false);
    });
  }, []);

  const emailPasswordLogin = async (
    email: string,

    password: string
  ) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) setError(error.message);
  };

  const emailPasswordSignUp = async (
    email: string,
    username: string,
    password: string
  ) => {
    // if (password.length < 6) {
    //   setError("Password must be longer than 6 characters");
    // }
    // Check if username exists in db
    const { data: userData, error: userDataError } = await supabase
      .from("profiles")
      .select("*")
      .eq("username", username);

    if (userDataError) {
      setError(userDataError.message);
    }

    if (userData?.length) {
      setError(`User name ${username} already exists. Try another`);
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
          profile_image: "",
        },
      },
    });

    if (error) setError(error.message);
  };

  const googleLogin = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: getURL(),
      },
    });

    if (error) setError(error.message);
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) setError(error.message);

    setUser(undefined);
  };

  const resetPasswordFromEmail = async (email: string) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: getURL(),
    });

    if (error) setError(error.message);
  };

  const value = {
    user,
    emailPasswordLogin,
    emailPasswordSignUp,
    googleLogin,
    logout,
    resetPasswordFromEmail,
    error,
    loadingUser,
  };

  return <UserContext.Provider value={value} {...props} />;
};

export const useSupaUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error(`useUser must be used within a MyUserContextProvider.`);
  }
  return context;
};
