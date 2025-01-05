export const calculateAge = (birthDate: string): string => {
  const birth = new Date(birthDate);
  const now = new Date();
  const years = now.getFullYear() - birth.getFullYear();
  const months = now.getMonth() - birth.getMonth() + years * 12;
  const totalYears = Math.floor(months / 12);
  const remainingMonths = months % 12;

  if (totalYears === 0) {
    return `${remainingMonths} month${remainingMonths > 1 ? "s" : ""}`;
  } else if (totalYears < 3) {
    return `${totalYears} year${totalYears > 1 ? "s" : ""}, ${remainingMonths} month${
      remainingMonths > 1 ? "s" : ""
    }`;
  } else {
    return `${totalYears} year${totalYears > 1 ? "s" : ""}`;
  }
};
