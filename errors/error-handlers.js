exports.handlePsqlErrors = (err, req, res, next) => {
  err.code ? res.status(400).json({ msg: err.message }) : next(err);
}

exports.handleCustomErrors = (err, req, res, next) => {
  err.status ? res.status(err.status).json({msg: err.msg})
    : res.status(500).json({msg: 'That wasn\'t supposed to happen'});
}