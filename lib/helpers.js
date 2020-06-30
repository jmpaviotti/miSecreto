exports.equals = function (a, b, opts) {
  if (a === b) return opts.fn(this);
  else return opts.inverse(this);
};

exports.formatDate = function (stamp) {
  let str = stamp.toISOString();
  return str.slice(8, 10) + str.slice(4, 8) + str.slice(0, 4);
};
