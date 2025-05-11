import iconFallback from '../assets/icon.jpg';

export const getUserImageUrl = (path) => {
  if (!path || path.trim() === "" || path === "null" || path === "string") {
    return iconFallback;
  }

  if (path.startsWith("data:image/")) {
    return path; // já é base64 válida
  }

  if (path.startsWith("blob:")) {
    return path; // é uma blob URL gerada localmente, por exemplo após upload
  }

  // se for puro base64 (sem prefixo), assume imagem JPEG
  return `data:image/jpeg;base64,${path}`;
};
