exports.handlePsqlErrors = (err, req, res, next) => {
  if(err.code) {
    res.status(400).json({ msg: err.message })
  }
  next(err);
}

exports.handleCustomErrors = (err, req, res, next) => {
  if(err.status) {
    res.status(err.status).json({msg: err.msg});
  }
  else res.status(500).json({msg: 'That wasn\'t supposed to happen'});
}