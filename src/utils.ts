import axios from "axios";
const baseURL = "https://admin-panel-c22z.onrender.com/api/";
export const customFetch = axios.create({
  baseURL: baseURL,
});

export const formatPhoneNumber = (value: string) => {
  // Raqamlardan boshqa hamma narsani olib tashlaymiz
  const cleaned = ("" + value).replace(/\D/g, "");

  // Kirilgan raqamlar soni bo'yicha probellar qo'shamiz
  if (cleaned.length <= 2) {
    return cleaned;
  }
  if (cleaned.length <= 5) {
    return `${cleaned.slice(0, 2)} ${cleaned.slice(2)}`;
  }
  if (cleaned.length <= 7) {
    return `${cleaned.slice(0, 2)} ${cleaned.slice(2, 5)} ${cleaned.slice(5)}`;
  }
  if (cleaned.length <= 9) {
    return `${cleaned.slice(0, 2)} ${cleaned.slice(2, 5)} ${cleaned.slice(
      5,
      7
    )} ${cleaned.slice(7)}`;
  }

  // Agar raqamlar soni 9 bo'lsa, formatni to'liq kiritamiz
  return `${cleaned.slice(0, 2)} ${cleaned.slice(2, 5)} ${cleaned.slice(
    5,
    7
  )} ${cleaned.slice(7, 9)}`;
};
