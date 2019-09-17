exports.handlePsqlErrors = (err, req, res, next) => {
  if(err.code) {
    console.log(err.message)
    res.status(400).json({ msg: err.message })
  }
  next(err);
}

exports.handleCustomErrors = (err, req, res, next) => {
  if(err.status) {
    res.status(err.status).json({msg: err.msg});
  }
}