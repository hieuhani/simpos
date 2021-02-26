import dayjs from "dayjs";

export function formatMoney(number: number = 0, withUnit = true) {
  return `${number.toLocaleString("vi")}${withUnit ? "đ" : ""}`;
}

export function formatDate(date: dayjs.ConfigType, format = "DD/MM/YYYY") {
  return dayjs(date).format(format);
}
