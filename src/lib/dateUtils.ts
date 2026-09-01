export const getDatesInRange = (startDate: string, endDate: string): string[] => {
  const dates = [];
  let currentDate = new Date(startDate);
  const stopDate = new Date(endDate);
  // Add 1 day buffer to handle timezones
  currentDate.setDate(currentDate.getDate() + 1);
  stopDate.setDate(stopDate.getDate() + 1);
  while (currentDate <= stopDate) {
    dates.push(currentDate.toISOString().split('T')[0]);
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return dates;
};
