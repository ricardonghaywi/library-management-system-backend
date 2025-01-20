export function calculateAge(birthDate: Date): number {
  const today = new Date();
  const birth = new Date(birthDate);

  let age = today.getFullYear() - birth.getFullYear();
  const hasNotHadBirthdayThisYear =
    today.getMonth() < birth.getMonth() ||
    (today.getMonth() === birth.getMonth() &&
      today.getDate() < birth.getDate());

  if (hasNotHadBirthdayThisYear) {
    age--;
  }

  return age;
}
