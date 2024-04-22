let position = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
updateBoard();

function updatePosition() {
  position = document.getElementById("positionInput").value;
  greed = document.getElementById("greedInput").value;
  document.getElementById("positionInput").value = "";
  document.getElementById("greedInput").value = "";
  sendFen(position, greed);
  updateBoard();
}

function updateBoard() {
  let c = document.getElementById("board");
  let ctx = c.getContext("2d");

  let currentPositionText = document.getElementById("currentPositionText");
  currentPositionText.innerHTML = position;

  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      ctx.fillStyle = (i + j) % 2 == 0 ? "#FFFFFF" : "#888888";
      ctx.fillRect(i * 60, j * 60, 60, 60);
    }
  }

  let currPiece = 0;
  let currSquare = 0;
  while (position[currPiece] && position[currPiece] != " ") {  
    let piece = position[currPiece];
    if (!isNaN(piece)) {
      currSquare += parseInt(piece);
      currPiece++;
      continue;
    }

    if (piece == "/") {
      currPiece++;
      continue;
    }

    let x = currSquare % 8;
    let y = Math.floor(currSquare / 8);

    let img = new Image();
    img.addEventListener("load", function() {
      ctx.drawImage(img, x * 60, y * 60);
    });
    img.src = `static/pieces/${piece}.png`;
    console.log(img.src, x, y);

    currSquare++;
    currPiece++;
  }
}

function sendFen(fen, greed) {
  fetch('http://127.0.0.1:5000/process_fen', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ fen: fen, greed: greed })
  })
  .then(response => response.json())
  .then(data => {
    console.log('Success:', data);
    // Update the frontend with BFS and DFS results, including execution times
    if (data.result.generate_time_s) {
      document.getElementById('generateTime').textContent = `Time taken to generate graph: ${data.result.generate_time_s} s`
    }
    if (data.result.dfs_best_move) {
      document.getElementById('dfsBestMove').textContent = `DFS Best Move: ${data.result.dfs_best_move} (Time: ${data.result.dfs_time_ms} ms)`;
    } else {
      document.getElementById('dfsBestMove').textContent = `DFS Best Move: No move found`;
    }
    if (data.result.bfs_best_move) {
      document.getElementById('bfsBestMove').textContent = `BFS Best Move: ${data.result.bfs_best_move} (Time: ${data.result.bfs_time_ms} ms)`;
    } else {
      document.getElementById('bfsBestMove').textContent = `BFS Best Move: No move found`;
    }
  })
  .catch((error) => {
    console.error('Error:', error);
    // Handle errors gracefully on the frontend
    document.getElementById('dfsBestMove').textContent = 'DFS Best Move: Error fetching data';
    document.getElementById('bfsBestMove').textContent = 'BFS Best Move: Error fetching data';
  });
}


