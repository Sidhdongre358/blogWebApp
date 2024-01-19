// Error Handling Middleware
const errorHandler = (error, req, res, next) => {
  console.error("An error occurred:", error);
  res.status(500).send({ error: "Internal Server Error" });
};
export default errorHandler;
