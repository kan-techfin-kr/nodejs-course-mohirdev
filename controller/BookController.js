const fs = require("fs");
const path = require("path");
const fileName = "books.json";
const inner__dirname = path.join(__dirname, "../");
const filePath = path.join(inner__dirname, "config", fileName);

class BookController {
  constructor() {}

  async getAll(req, res) {
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
  }

  async addForm(req, res) {
    res.sendFile(path.join(inner__dirname, "views", "create-book.html"));
  }

  async getOneById(req, res) {
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
  }

  async updateByIdForm(req, res) {
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
            return res.status(404).send("book not found");
          }

          res.send(`
            <html>
                <body>
                  <h1>Updating a book by id: ${bookId}</h1>
                    <form action="/books/${bookId}" method="POST">
                    <div>
                      <label for="">title:</label>
                      <br />
                      <input type="text" name="title" placeholder="title of the book" value="${foundBook.title}" required />
                    </div>
                     <div>
                       <label for="">author:</label>
                       <br />
                       <input type="text" name="author" placeholder="author of the book" value="${foundBook.author}" required />
                     </div>
                     <br />
                     <div>
                       <button type="submit">Submit</button>
                     </div>
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
  }

  async createNew(req, res) {
    {
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
            const foundBook = jsonData.find(
              (book) => book.title.toLowerCase() === title.toLowerCase()
            );
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
    }
  }

  async updateById(req, res) {
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
  }

  async deleteById(req, res) {
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
  }
}

module.exports = new BookController();
