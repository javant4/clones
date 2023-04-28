import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import {
  getDiscoverUser,
  getDiscoverUserCreatedPins,
  getDiscoverUserSavedPins,
} from "../sprout_discover_backend/lib/sanity.client";

export function useFetchDiscoverUser() {
  const [user, setUser] = useState<DiscoverUser>();

  useEffect(() => {
    const userInfo =
      localStorage.getItem("user") !== "undefined"
        ? JSON.parse(localStorage.getItem("user")!)
        : localStorage.clear();

    if (userInfo) {
      getDiscoverUser(userInfo.id).then((data) => setUser(data));
      console.log("Ran get user query again");
    }
  }, []);

  return { user };
}
export function useFetchDiscoverProfileUser(userId: string) {
  const [user, setUser] = useState<DiscoverUser>();
  useEffect(() => {
    getDiscoverUser(userId).then((data) => setUser(data));
    console.log("Ran get user profile query again");
  }, []);

  return { user };
}

export function useFetchDiscoverUserCreatedPins(userId: string) {
  const [pins, setPins] = useState<DiscoverPin[]>();
  useEffect(() => {
    getDiscoverUserCreatedPins(userId).then((data) => setPins(data));
    console.log("Ran get user profile query again");
  }, []);

  console.log("Created pins: ", pins);
  return pins;
}

export function useFetchDiscoverUserSavedPins(userId: string) {
  const [pins, setPins] = useState<DiscoverPin[]>();
  useEffect(() => {
    getDiscoverUserSavedPins(userId).then((data) => setPins(data));
    console.log("Ran get user profile query again");
  }, []);
  console.log("Saved pins: ", pins);

  return pins;
}
