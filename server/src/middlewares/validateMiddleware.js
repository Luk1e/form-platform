const validate = (schema, queryParams = false) => {
  return (req, res, next) => {
    let queryError = null;

    if (queryParams) {
      const { error } = schema.validate(req.query);
      queryError = error;
    } else {
      const { error } = schema.validate(req.body);
      queryError = error;
    }

    if (queryError) {
      return res.status(400).json({
        message: "Validation Error",
        errors: queryError.details.map((detail) => ({
          message: detail.message,
          path: detail.path,
        })),
      });
    }
    next();
  };
};
export default validate;
