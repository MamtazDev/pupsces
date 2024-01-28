export const endPoint =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : `https://curriculum-evaluation-5da2a2dd9068.herokuapp.com`;
