function vote(id, value) {
  fetch('http://localhost:500/secretos', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id: id, vote: value }),
  })
    .then((response) => response.json())
    .then((json) => {
      console.log(json);
    });
}
