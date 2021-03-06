exports.handlePsqlErrors = (err, req, res, next) => {
  const errors = {
    '42703': {
      status: 400,
      msg: 'Invalid Column Query'
    },
    '22P02': {
      status: 400,
      msg: 'Invalid Input'
    },
    '23503': {
      status: 400,
      msg: 'Invalid reference ID'
    },
    '23502': {
      status: 400,
      msg: 'Invalid Input'
    },
    '2201W': {
      status: 400,
      msg: 'Invalid Page Limit'
    }
  }

  return errors.hasOwnProperty(err.code)
    ? res.status(errors[err.code].status).json({ msg: errors[err.code].msg })
    : next(err);
}

exports.handleCustomErrors = (err, req, res, next) => {
  return err.status ? res.status(err.status).json({msg: err.msg})
    : res.status(500).json({msg: 'Internal Server Error'});
}

exports.methodError = (req, res, next) => {
  res.status(405).json({msg: 'method not allowed'})
}