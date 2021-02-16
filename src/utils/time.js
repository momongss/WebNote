export function getformattedTime() {
  const date = new Date();
  let year = date.getFullYear();
  let month = 1 + date.getMonth();
  month = month >= 10 ? month : "0" + month;
  let day = date.getDate();
  day = day >= 10 ? day : "0" + day;
  let hour = date.getHours();
  let minutes = date.getMinutes();
  const formattedTime =
    year + "-" + month + "-" + day + " " + hour + ":" + minutes;

  return formattedTime;
}
