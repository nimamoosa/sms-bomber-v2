import axios from "axios";
import UserAgent from "user-agents";

function generateRandomIP() {
  const randomOctet = () => Math.floor(Math.random() * 256);
  return `${randomOctet()}.${randomOctet()}.${randomOctet()}.${randomOctet()}`;
}

export const api = (() => {
  const apiRes = axios.create({
    headers: {
      "X-Forward-For": generateRandomIP(),
      "User-Agent": new UserAgent().toString(),
    },
    withCredentials: true,
  });

  // Interceptor for handling errors globally
  apiRes.interceptors.response.use(
    (response) => response, // If the response is successful, just return it
    (error) => {
      console.error("API Request failed: ", error.message, error.config.url);
      return Promise.resolve({ status: "error", message: error.message }); // Return a resolved promise with an error status
    }
  );

  return apiRes;
})();
