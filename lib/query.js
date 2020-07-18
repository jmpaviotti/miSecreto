function selectQuery(req, page, expressions) {
  let sortby = "id",
    order = "desc",
    offset,
    query;

  if (req.sortby == "votes") sortby = "votes";
  if (req.order == "asc") order = "asc";
  offset = typeof page == "number" ? (page - 1) * 10 : 0;

  if (req.term) {
    query = {
      text: `SELECT * FROM secretos WHERE unaccent(content) ILIKE ALL($1) ORDER BY ${sortby} ${order} LIMIT 10 OFFSET ${offset}`,
      values: [expressions],
    };
  } else {
    query = `SELECT * FROM secretos ORDER BY ${sortby} ${order} LIMIT 10 OFFSET ${offset}`;
  }

  return query;
}

function countQuery(terms) {
  let query;

  if (!terms) {
    query = "SELECT COUNT(*) FROM secretos";
  } else {
    query = {
      text:
        "SELECT COUNT(*) FROM secretos WHERE unaccent(content) ILIKE ALL($1)",
      values: [terms],
    };
  }

  return query;
}

function voteQuery(id, value, session) {
  const query = {};

  if (value === 1 || value === -1) {
    query.text = "UPDATE secretos SET votes = votes + $1 WHERE id = $2";
    if (!session[id]) {
      session[id] = value;
      query.values = [value, id];
    } else if (session[id] === value) {
      delete session[id];
      query.values = [value * -1, id];
    } else {
      session[id] = value;
      query.values = [value * 2, id];
    }
  }

  return query;
}

module.exports = {
  selectQuery: selectQuery,
  countQuery: countQuery,
  voteQuery: voteQuery,
};
