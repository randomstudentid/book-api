document.getElementById("form1").addEventListener("submit", submitFunction);
document.getElementById("form2").addEventListener("submit", searchFunction);
async function submitFunction(e) {
  e.preventDefault();
  var res = document.getElementById("results");
  while (res.firstChild) {
    res.removeChild(res.firstChild);
  }

  var name = document.getElementById("name1").value;
  var title = document.getElementById("title1").value;
  var genre = document.getElementById("genre1").value;
  var price = document.getElementById("price1").value;
  const data = { name, title, genre, price };

  var json_data = JSON.stringify(data);

  var xhr = new XMLHttpRequest();
  xhr.open("POST", "/insertBook");
  xhr.setRequestHeader("Content-type", "application/json; charset=utf-8");
  xhr.onload = function() {
    var json = JSON.parse(xhr.responseText);
    if (xhr.readyState == 4 && xhr.status == "200") {
      console.log(json);
      if (json.status === "success") {
        const title = document.createElement("h2");
        title.textContent = "Επιτυχής εισαγωγή βιβλίου";
        document.getElementById("results").append(title);
      } else {
        const title = document.createElement("h2");
        title.textContent = "Η εισαγωγή βιβλίου απέτυχε";
        document.getElementById("results").append(title);
      }
    } else {
      console.log(json);
      const title = document.createElement("h2");
      title.textContent = "Η εισαγωγή βιβλίου απέτυχε";
      document.getElementById("results").append(title);
    }
  };
  xhr.send(json_data);
}

async function searchFunction(e) {
  e.preventDefault();
  //Taking the information out of the html form to construct the SQL query
  var name = document.getElementById("name2").value;
  var title = document.getElementById("title2").value;
  var genre = document.getElementById("genre2").value;
  var price = document.getElementById("price2").value;
  if (name != "" || title != "" || genre != 0 || price != "") { 
  //Έλεγχος ώστε να μην κάνει αναζήτηση αν δεν γίνει καμία εισαγωγή φίλτρου αναζήτησης
    if (name == "") {
      name = "*";
    }
    if (title == "") {
      title = "*";
    }
    if (genre == 0) {
      genre = "*";
    }
    if (price == "") {
      price = "*";
    }
    let xhr = new XMLHttpRequest();
    xhr.open("GET",`/books/title/${title}/author/${name}/genre/${genre}/price/${price}`);

    // request state change event
    xhr.onreadystatechange = function() {
      // request completed?
      if (this.readyState == 4 && this.status == 200) {
        // Clearing the div used to display the books
        var div = document.getElementById("results");
        while (div.firstChild) {
          div.removeChild(div.firstChild);
        }
        var library = JSON.parse(this.responseText);
        // request successful - show response
        if (library.length != 0) {
          const header = document.createElement("h2");
          header.textContent = "Aποτελέσματα αναζήτησης:";
          document.getElementById("results").append(header);
          for (var book of library) {
            const root = document.createElement("div");
            root.className = "result";
            const title = document.createElement("h3");
            const author = document.createElement("div");
            const genre = document.createElement("div");
            const price = document.createElement("div");
            const id = document.createElement("div");
            const br = document.createElement("br");
            title.textContent = `${book.title}`;
            genre.textContent = `Genre: ${book.genre}`;
            author.textContent = `Book Author: ${book.author}`;
            price.textContent = `Price: ${book.price} ‎€`;
            id.textContent = `Book ID: ${book.id}`;

            root.append(title, id, author, genre, price);
            document.getElementById("results").append(root, br);
          }
        } else {
          const title = document.createElement("h2");
          title.textContent = "Δεν βρέθηκαν αποτελέσματα αναζήτησης";
          document.getElementById("results").append(title);
        }
        console.log(library);
        return false;
      } else {
        // request error
        console.log("HTTP error", xhr.status, xhr.statusText);
      }
    };

    // start request
    xhr.send();
  } else {
    var div = document.getElementById("results");
    while (div.firstChild) {
      div.removeChild(div.firstChild);
    }
    const title = document.createElement("h2");
    title.textContent = "Εισάγετε τουλάχιστον ένα φίλτρο αναζήτησης";
    document.getElementById("results").append(title);
  }
}
