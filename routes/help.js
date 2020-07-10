const db = require('../db');

function getUrlBase(query) {
  let base;

  if (query.term) {
    base = 'term=' + query.term + '&';
  } else {
    base = '';
  }

  return base;
}

function getPageData(query) {
  const { page = 1, term = '' } = query;
  const pageData = {
    base: getUrlBase(query),
    previous: Number(page) - 1,
    current: Number(page),
    next: Number(page) + 1,
    total: 1,
  };

  return db
    .query(`SELECT COUNT(*) FROM secretos WHERE content LIKE '%${term}%'`)
    .then((data) => {
      pageData.total = Math.ceil(data.rows[0].count / 10);
      pageData.current >= 1 && pageData.current <= pageData.total
        ? (pageData.display = true)
        : (pageData.display = false);
    })
    .catch((e) => console.error(e.stack))
    .then(() => {
      return pageData;
    });
}

exports.getPageData = getPageData;
