// common functions

// validate user id
const validateId = (id, res) => {
  if (!id) {
    res.status(400).json({ error: " ID not provided" });
    return false;
  }
  return true;
};
// validate user id
const validatePostId = (id, res) => {
  if (!id) {
    res.status(400).json({ error: "Post ID not provided" });
    return false;
  }
  return true;
};
// handle Server Error

const handleServerError = (res, errorMessage) => {
  console.error(errorMessage);
  res.status(500).json({ error: errorMessage });
};

// handle Success
const handleSuccess = (res, data) => {
  res.status(200).json({
    status: "Success!",
    data: data,
  });
};

export { validateId, validatePostId, handleServerError, handleSuccess };
