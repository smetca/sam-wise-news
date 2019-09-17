exports.handlePsqlErrors = (err, req, res, next) => {
  // console.log(err)
  next(err);
}

exports.handleCustomErrors = (err, req, res, next) => {
  if(err.status) {
    res.status(err.status).json({msg: err.msg});
  }
}