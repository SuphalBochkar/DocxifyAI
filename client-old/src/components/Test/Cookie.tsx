import { useState } from "react";
import axios from "axios";

const Cookie = () => {
  const [cookieStatus, setCookieStatus] = useState<string>("");

  const checkCookies = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/v1/test/cookie",
        {
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        const cookies = document.cookie;
        if (cookies.includes("token"))
          setCookieStatus("Cookie found: " + cookies);
        else setCookieStatus("No token cookie found");
      } else setCookieStatus("Failed to connect to server");
    } catch (error) {
      console.error("Error checking cookies:", error);
      setCookieStatus(
        "Error: " + (error instanceof Error ? error.message : String(error))
      );
    }
  };

  return (
    <div>
      <button
        onClick={checkCookies}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 cursor-pointer"
      >
        Check Cookies
      </button>
      <p>{cookieStatus}</p>
    </div>
  );
};

export default Cookie;
