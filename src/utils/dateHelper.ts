import moment from "moment";

export const formatDate = (date: Date) => moment(date).format("DD/MM/YYYY");
export const formatDateTime = (date: Date) =>
  moment(date).format("DD/MM/YYYY HH:mm");
