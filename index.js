const express = require("express");
const app = express();
var sqlite3 = require("sqlite3").verbose();
let books = [];

app.listen(3000, function() {
  console.log("listening at port 3000");
});
app.use(express.static("books"));
app.use(express.json());

app.post("/insertBook", function(request, response) {
  var book = request.body;
  console.log(book);
  var db = new sqlite3.Database("./books.sqlite3");
  db.run(
    `INSERT INTO books(id,author,title,genre,price) VALUES(?,?,?,?,?)`,
    [null, book.name, book.title, book.genre, parseFloat(book.price)],
    function(err) {
      if (err) {
        response.json({
          status: "could not insert values into table"
        });
        console.log(err.message);
      } else {
        response.json({
          status: "success"
        });
      }
    }
  );
});

app.get("/books/title/:title", function(req, res) {
  const title = req.params.title;
  console.log(JSON.stringify(req.params));
  var db = new sqlite3.Database("./books.sqlite3");
  var data = req.body;
  db.all(`SELECT * FROM books WHERE title LIKE '%${title}%'`, function(
    err,
    rows
  ) {
    if (!err) {
      console.log(JSON.stringify(rows));
      res.json(rows);
    } else {
      res.status(400).json({ error: err.message });
    }
  });
});

app.get("/books/title/:title/author/:name/genre/:genre/price/:price", function(
  req,
  res
) {
  var db = new sqlite3.Database("./books.sqlite3");
  var data = req.params;
  if (data.name === "*") {
    data.name = "";
  }
  if (data.title === "*") {
    data.title = "";
  }
  if (data.genre === "*") {
    data.genre = "";
  }
  if (data.price === "*") {
    data.price = 0;
  }
  db.all(
    `SELECT * FROM books WHERE author LIKE '%${data.name}%' AND title LIKE '%${data.title}%' AND genre LIKE '%${data.genre}%' AND price BETWEEN '${data.price}' AND 999999;`,
    function(err, rows) {
      if (!err) {
        console.log(JSON.stringify(rows));
        res.json(rows);
      } else {
        console.log("Error in db");
      }
    }
  );
  console.log(req.params);
});
