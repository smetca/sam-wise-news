exports.formatDates = list => {
  return list.map(({created_at: val, ...rest}) => {
    const newObj = {
      created_at: new Date(val),
      ...rest
    }
    return newObj;
  })
};

exports.makeRefObj = (list, refKey = 'title', refVal = 'article_id') => {
  return list.reduce((refObj, {[refKey]: key, [refVal]: val}) => {
    refObj[key] = val;
    return refObj;
  }, {})
};

exports.formatComments = (comments, articleRef) => {
  return comments.map(({belongs_to, created_by: val, ...rest}) => {
    const formattedComment = {
      article_id: articleRef[belongs_to],
      author: val,
      ...rest
    };
    return formattedComment;
  })
};
