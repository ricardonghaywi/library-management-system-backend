export function calculateReturnDate(
  dateBorrowed: Date,
  numberOfBorrowableDays: number,
): Date {
  const borrowedDate = new Date(dateBorrowed);
  const returnDate = new Date(borrowedDate);

  returnDate.setDate(borrowedDate.getDate() + numberOfBorrowableDays);

  return returnDate;
}
