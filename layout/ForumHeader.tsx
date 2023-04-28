import React, { useState, createContext, useContext, useEffect } from "react";
import DiscoverSideBar from "../components/DiscoverSideBar";
import { getDiscoverUser } from "../sprout_discover_backend/lib/sanity.client";
import { useSession } from "next-auth/react";
import NavBar from "../components/NavBar/NavBar";

// const DiscoverUserContext = createContext<DiscoverUser | undefined>(undefined);

// export function useDiscoverUser() {
//   const user = useContext(DiscoverUserContext);
//   if (user === null) {
//     throw new Error(
//       "useDiscoverUser must be called in a child of DiscoverHeaderLayout"
//     );
//   }

//   return user;
// }

export default function ForumHeaderLayout({
  children,
}: {
  children: React.ReactElement;
}) {
  const { data: session } = useSession();
  // const [toggleSideBar, setToggleSideBar] = useState<boolean>(false);

  // // const { user } = useFetchDiscoverUser();

  // const [user, setUser] = useState<DiscoverUser>();

  // useEffect(() => {
  //   const userInfo =
  //     localStorage.getItem("user") !== "undefined"
  //       ? JSON.parse(localStorage.getItem("user")!)
  //       : localStorage.clear();
  //   if (userInfo) {
  //     getDiscoverUser(userInfo.id).then((data) => setUser(data));
  //     console.log("Ran get user query again");
  //   }
  // }, [session]);

  return (
    <>
      <NavBar />
      <main>{children}</main>
    </>
  );
}
