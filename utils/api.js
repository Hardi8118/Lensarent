const isMobile = true; // Change this to false for localhost

const mobileBaseUrl = "http://192.168.141.131:3000";
const localhostBaseUrl = "http://localhost:3000";

export const baseUrl = isMobile ? mobileBaseUrl : localhostBaseUrl;
