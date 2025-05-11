import iconFallback from '../assets/icon.jpg';

export const getUserImageUrl = (path) => {
  if (!path || path.trim() === "" || path === "null" || path === "string") {
    return iconFallback;
  }

  if (path.startsWith("data:image/")) {
    return path; 
  }

  if (path.startsWith("blob:")) {
    return path;
  }

  return `data:image/jpeg;base64,${path}`;
};
