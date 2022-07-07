export const getQuoteStatusColor = (statusCode) => {
  switch (statusCode) {
    case "ACCEPTED":
      return "green";
    default:
      return "black";
  }
};
