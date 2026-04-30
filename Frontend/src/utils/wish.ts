export const getWish = () => {
  return JSON.parse(localStorage.getItem("wish") || "[]");
};

export const saveWish = (wish: any[]) => {
  localStorage.setItem("wish", JSON.stringify(wish));
  
};