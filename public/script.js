window.onload = (event) => {
  fetch('/secretos/vote')
    .then((response) => response.json())
    .then((data) => {
      for (const [id, value] of Object.entries(data)) {
        const secreto = document.querySelector(`#s${id}`);
        if (value > 0) {
          secreto.querySelector('.upvote').classList.add('toggled');
        } else if (value < 0) {
          secreto.querySelector('.downvote').classList.add('toggled');
        }
      }
    })
    .catch((error) => console.error('Error:', error));
};

function vote(id, value) {
  const data = { id: id, vote: value };

  fetch('/secretos/vote', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((data) => {
      const secreto = document.querySelector(`#s${id}`);
      const up = document.querySelector('.upvote');
      const down = document.querySelector('.downvote');
      //
      secreto.querySelector('.score').innerHTML = data.votes;
      //
      if (value == 1) {
        up.classList.contains('toggled')
          ? up.classList.remove('toggled')
          : up.classList.add('toggled');
        down.classList.remove('toggled');
      } else if (value == -1) {
        down.classList.contains('toggled')
          ? down.classList.remove('toggled')
          : down.classList.add('toggled');
        up.classList.remove('toggled');
      }
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}
