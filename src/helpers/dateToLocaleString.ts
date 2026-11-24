// dateToLocaleString(date:Date):

export default function (dateData: Date): string {
  return dateData.toLocaleString("tr-tr", { dateStyle: "full", timeStyle: "medium" });
}
