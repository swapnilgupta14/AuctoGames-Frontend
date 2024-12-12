export function convertTo12HourFormat(time) {
  let [hours, minutes, seconds] = time.split(":").map(Number);
  let period = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")} ${period}`;
}
