import iconFallback from '../assets/icon.jpg';

export const getUserImageUrl = (path) => {
  if (path && path.trim() !== "" && path !== "null" && path !== "string") {
    return `data:image/jpeg;base64,${path}`; // Convertendo para base64
  } else {
    return iconFallback; // Retorna o ícone de fallback caso o caminho da imagem seja inválido
  }
};
