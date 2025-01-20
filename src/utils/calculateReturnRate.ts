export function calculateReturnRate(
  numOfBooksReturnedOnTime: number,
  totalBorrowedBooks: number,
): number {
  return (numOfBooksReturnedOnTime / totalBorrowedBooks) * 100;
}
