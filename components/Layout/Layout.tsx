import React from "react";
import NavBar from "../NavBar/NavBar";

const Layout = ({ children }: { children: React.ReactNode }) => {
  // useAuth(); // will implement later at end of tutorial

  return (
    <>
      <NavBar />
      {children}
    </>
  );
};

export default Layout;
