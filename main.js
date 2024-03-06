const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const fileName = "books.json";
const filePath = path.join(__dirname, "config", fileName);

// done
app.get("/", (req, res) => {
  res.send("<h1>Express is working perfectly...</h1>");
});

// done
app.get("/books", (req, res) => {
  fs.readFile(filePath, "utf-8", (err, data) => {
    if (err) {
      console.log("Error reading file:", err);
      res.status(500).send("Internal Server Error");
    } else {
      try {
        let jsonData;
        if (data?.trim()?.length) {
          jsonData = JSON.parse(data);
          console.log("parsing data");
        } else {
          jsonData = [];
          console.log("there is no data yet");
        }
        res.status(200).json(jsonData);
      } catch (error) {
        console.log("Error parsing JSON:", error);
        res.status(500).send("Internal Server Error");
      }
    }
  });
});

// done
app.get("/books/:id", (req, res) => {
  const bookId = parseInt(req.params.id);
  fs.readFile(filePath, "utf-8", (err, data) => {
    if (err) {
      console.log("Error reading file:", err);
      res.status(500).send("Internal Server Error");
    } else {
      try {
        const jsonData = JSON.parse(data);
        const foundBook = jsonData.find((book) => book.id === bookId);
        if (!foundBook) {
          return res.status(404).send("Book not found");
        }
        res.status(200).json(foundBook);
      } catch (error) {
        console.log("Error parsing JSON:", error);
        res.status(500).send("Internal Server Error");
      }
    }
  });
});

// done
app.get("/create-book", (req, res) => {
  res.send(`
      <html>
          <body>
              <p>Creating new book</p>
              <form action="/books" method="POST">
                  <input type="text" name="title" placeholder="title of the book" required />
                  <br />
                  <input type="text" name="author" placeholder="author of the book" required />
                  <br />
                  <button type="submit">Submit</button>
              </form>
          </body>
      </html>
      `);
});

// done
app.post("/books", (req, res) => {
  console.log(req.body);
  const { title, author } = req.body;
  if (!title || !author) {
    return res.status(400).send("Title and author are required");
  }

  fs.readFile(filePath, "utf-8", (err, data) => {
    if (err) {
      console.log("Error reading file:", err);
      res.status(500).send("Internal Server Error");
    } else {
      try {
        let jsonData;
        console.log(data);
        if (data?.trim()?.length) {
          jsonData = JSON.parse(data);
        } else {
          jsonData = [];
        }
        const foundBook = jsonData.find((book) => book.title.toLowerCase() === title.toLowerCase());
        if (foundBook) {
          return res.send("<p>This book already exists! Please enter a different book.</p>");
        }

        const newBook = {
          id: jsonData.length > 0 ? jsonData[jsonData.length - 1].id + 1 : 1,
          title,
          author,
        };

        jsonData.push(newBook);
        fs.writeFileSync(filePath, JSON.stringify(jsonData, null, 2), "utf-8");
        res.redirect("/books");
      } catch (error) {
        console.log("Error parsing JSON:", error);
        res.status(500).send("Internal Server Error");
      }
    }
  });
});

// done
app.get("/update-book/:id", (req, res) => {
  const bookId = parseInt(req.params.id);

  fs.readFile(filePath, "utf-8", (err, data) => {
    if (err) {
      console.log("Error reading file:", err);
      res.status(500).send("Internal Server Error");
    } else {
      try {
        const jsonData = JSON.parse(data);
        const foundBook = jsonData.find((book) => book.id === bookId);
        if (!foundBook) {
          return res.status(404).send("Book not found");
        }

        res.send(`
        <html>
            <body>
              <p>Updating a book by id: ${bookId}</p>
                <form action="/books/${bookId}" method="POST">
                    <input type="text" name="title" placeholder="title of the book" value="${foundBook.title}" required />
                    <br />
                    <input type="text" name="author" placeholder="author of the book" value="${foundBook.author}" required />
                    <br />
                    <button type="submit">Submit</button>
                </form>
            </body>
        </html>
        `);
      } catch (error) {
        console.log("Error parsing JSON:", error);
        res.status(500).send("Internal Server Error");
      }
    }
  });
});

// done
// updating post method instead of put
app.post("/books/:id", (req, res) => {
  const bookId = parseInt(req.params.id);
  const { title, author } = req.body;

  fs.readFile(filePath, "utf-8", (err, data) => {
    if (err) {
      console.log("Error reading file:", err);
      res.status(500).send("Internal Server Error");
    } else {
      try {
        const jsonData = JSON.parse(data);
        const foundBook = jsonData.find((book) => book.id === bookId);
        if (!foundBook) {
          return res.status(404).send("Book not found");
        }

        foundBook.title = title || foundBook.title;
        foundBook.author = author || foundBook.author;

        fs.writeFileSync(filePath, JSON.stringify(jsonData, null, 2), "utf-8");
        res.redirect(`/books/${bookId}`);
      } catch (error) {
        console.log("Error parsing JSON:", error);
        res.status(500).send("Internal Server Error");
      }
    }
  });
});

// done
app.delete("/books/:id", (req, res) => {
  const bookId = parseInt(req.params.id);

  fs.readFile(filePath, "utf-8", (err, data) => {
    if (err) {
      console.log("Error reading file:", err);
      res.status(500).send("Internal Server Error");
    } else {
      try {
        let jsonData = JSON.parse(data);
        const filteredData = jsonData.filter((book) => book.id !== bookId);

        if (jsonData.length === filteredData.length) {
          return res.status(404).send("Book not found");
        }

        fs.writeFileSync(filePath, JSON.stringify(filteredData, null, 2), "utf-8");
        res.redirect("/books");
      } catch (error) {
        console.log("Error parsing JSON:", error);
        res.status(500).send("Internal Server Error");
      }
    }
  });
});

// done
app.all("*", (req, res) => {
  res.status(404).send("<h1>Not Found Page</h1>");
});

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
