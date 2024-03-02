export const error = (req, res, next) => {
  try {
    const error = new Error(`endpoint tidak ditemukan`);

    throw error;
  } catch (err) {
    if (!err.statusCode) err.statusCode = 404;
    next(err);
  }
};
