const db = require("../db");
const queries = require("./query");

function validateInsert(body) {
  let { author, gender, age, content } = body;
  const errors = [];

  if (!author) {
    errors.push({ text: "Nombre inválido." });
  }

  if (!gender) {
    errors.push({ text: "Seleccione género." });
  }

  if (age < 18 || age > 100) {
    errors.push({ text: "Edad inválida" });
  }

  if (content.length < 10) {
    errors.push({ text: "Secreto muy corto." });
  } else if (content.length > 500) {
    errors.push({ text: "Secreto muy largo." });
  }

  return errors;
}

function parseTerms(terms) {
  let expressions;
  if (terms) expressions = terms.split(" ").map((str) => `%${str}%`);
  return expressions;
}

function getUrlBase(query) {
  let base = "";

  for (const [key, value] of Object.entries(query)) {
    if (key != "page") {
      base += `${key}=${value}&`;
    }
  }
  base += "page=";

  return base;
}

function getPageData(query) {
  const { page = 1 } = query;
  const pageData = {
    terms: parseTerms(query.term),
    base: getUrlBase(query),
    previous: Number(page) - 1,
    current: Number(page),
    next: Number(page) + 1,
    total: 1,
  };

  return db
    .query(queries.countQuery(pageData.terms))
    .then((data) => {
      pageData.total = Math.ceil(data.rows[0].count / 10);
      pageData.display =
        pageData.current >= 1 && pageData.current <= pageData.total
          ? true
          : false;
    })
    .catch((e) => console.error(e.stack))
    .then(() => {
      return pageData;
    });
}
module.exports = { validateInsert: validateInsert, getPageData: getPageData };
