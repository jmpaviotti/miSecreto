const db = require('../db');
const { query } = require('express');


function sanitizeQuery(req, page) {
  let sortby = 'id', order = 'desc', offset, query; 

  if(req.sortby == 'votes') sortby = 'votes';
  if(req.order == 'asc') order = 'asc';
  offset = (typeof(page) == 'number')? (page-1)*10 : 0; 

  if(req.term) {
    const expressions = req.term.split(' ').map(str => `%${str}%`)
    query = {text: `SELECT * FROM secretos WHERE content ILIKE ALL($1) ORDER BY ${sortby} ${order} LIMIT 10 OFFSET ${offset}`, values: [expressions]}
  } else {
    query = `SELECT * FROM secretos ORDER BY ${sortby} ${order} LIMIT 10 OFFSET ${offset}`;
  }
  
  return query;
}

function getUrlBase(query) {
  let base = '';

  for (const [key, value] of Object.entries(query)) {
    if(key != 'page'){
      base += `${key}=${value}&`
    }
  }
  base += 'page='

  return base;
}

function getPageData(query) {
  const { page = 1, term = '' } = query;
  const pageData = {
    term: query.term || '',
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
exports.sanitizeQuery = sanitizeQuery;
