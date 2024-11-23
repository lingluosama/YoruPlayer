"use client";
import { useEffect, useState } from "react";

const withAuth = (WarpedComponent) => {
  return (props) => {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
      setIsClient(true);
    }, []);

    useEffect(() => {
      if (isClient) {
        const token = localStorage.getItem("token");
        if (!token) {
          window.location.href = "/login";
        }
      }
    }, [isClient]);

    if (!isClient) {
      return null; 
    }

    return <WarpedComponent {...props} />;
  };
};

export default withAuth;
