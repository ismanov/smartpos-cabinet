import moment from "moment";
import { dateDiffernce } from "./dateDiffernce";

const nowDate = moment().format('YYYY-MM-DD');

export const disableOldDates = (date, currentDate = nowDate) => {
  const itemDate = moment(date).format('YYYY-MM-DD');

  return dateDiffernce(currentDate, itemDate) < 0;
};