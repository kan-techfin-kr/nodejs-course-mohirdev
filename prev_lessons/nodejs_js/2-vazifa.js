const http = require("http");
const fs = require("fs");
const path = require("path");

const fileName = "db.json";
const filePath = path.join(__dirname, fileName);

const server = http.createServer(async function (req, res) {
  // main route
  if (req.url === "/" && req.method === "GET") {
    res.end("<h1>nodejs is working perfectly...</h1>");

    // method: GET
    // desc: get all books
  } else if (req.url === "/books" && req.method === "GET") {
    fs.readFile(filePath, "utf-8", (err, data) => {
      if (err) {
        console.error("Error reading file:", err);
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end("Internal Server Error");
      } else {
        try {
          const jsonData = JSON.parse(data);
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify(jsonData));
        } catch (error) {
          console.error("Error parsing JSON:", error);
          res.writeHead(500, { "Content-Type": "text/plain" });
          res.end("Internal Server Error");
        }
      }
    });
    // method: GET
    // desc: get a book by id
  } else if (req.method === "GET" && req.url?.startsWith("/books/")) {
    let bookId = req.url?.split("/")[2];
    // @ts-ignore
    bookId = isNaN(bookId) ? bookId : Number(bookId);
    fs.readFile(filePath, "utf-8", (err, data) => {
      if (err) {
        console.error("Error reading file:", err);
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end("Internal Server Error");
      } else {
        try {
          const jsonData = JSON.parse(data);
          if (jsonData?.length < 1) {
            return res.end("ma'lumot topilmadi");
          }
          const foundBook = jsonData.find((book) => book.id === bookId);
          if (!foundBook) {
            return res.end("ma'lumot topilmadi");
          }
          res.end(JSON.stringify(foundBook));
        } catch (error) {
          console.error("Error parsing JSON:", error);
          res.writeHead(500, { "Content-Type": "text/plain" });
          res.end("Internal Server Error");
        }
      }
    });
    // method: POST
    // desc: update a book by id
    // javascript, fetchAPI orqali form bilan PUT method jo'natsa bo'ladi
  } else if (req.method === "POST" && req.url?.startsWith("/books/")) {
    let bookId = req.url?.split("/")[2];
    // @ts-ignore
    bookId = isNaN(bookId) ? bookId : Number(bookId);
    let body = [];
    req.on("data", (chunk) => {
      body.push(chunk);
    });
    req.on("end", () => {
      const parsedBody = Buffer.concat(body).toString();
      const [titleParsed, authorParsed] = parsedBody.split("&");

      const [title, author] = [
        titleParsed.split("=")[1].split("+").join(" "),
        authorParsed.split("=")[1].split("+").join(" "),
      ];
      console.log("title, author: ", title, author);

      fs.readFile(filePath, "utf-8", (err, data) => {
        if (err) {
          console.error("Error reading file:", err);
          res.writeHead(500, { "Content-Type": "text/plain" });
          res.end("Internal Server Error");
        } else {
          try {
            const jsonData = JSON.parse(data);
            if (jsonData?.length < 1) {
              return res.end("id bo'yicha ma'lumot topilmadi");
            }
            let updatedJsonData = jsonData?.map((book) => {
              if (book.id === bookId) {
                book.title = title || book.title;
                book.author = author || book.author;
              }
              return book;
            });
            fs.writeFileSync(filePath, JSON.stringify(updatedJsonData, null, 2), "utf-8");
            res.end("<p>muvaffaqiyatli yangi kitob yangilandi.</p>");
          } catch (error) {
            console.error("Error parsing JSON:", error);
            res.writeHead(500, { "Content-Type": "text/plain" });
            res.end("Internal Server Error");
          }
        }
      });
    });
    // method: GET
    // desc: form for creating new book
  } else if (req.method === "GET" && req.url === "/create-book") {
    res.end(`
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
    // method: GET
    // desc: form for updating a new book
  } else if (req.method === "GET" && req.url?.startsWith("/update-book/")) {
    let bookId = req.url?.split("/")[2];
    // @ts-ignore
    bookId = isNaN(bookId) ? bookId : Number(bookId);

    fs.readFile(filePath, "utf-8", (err, data) => {
      if (err) {
        console.error("Error reading file:", err);
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end("Internal Server Error");
      } else {
        try {
          const jsonData = JSON.parse(data);

          const foundBook = jsonData.find((book) => book.id === bookId);
          if (!foundBook) {
            return res.end("ma'lumot topilmadi");
          }
          console.log(foundBook);
          res.end(`
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
          console.error("Error parsing JSON:", error);
          res.writeHead(500, { "Content-Type": "text/plain" });
          res.end("Internal Server Error");
        }
      }
    });

    // method: POST
    // desc: create new book required: [title, author]
  } else if (req.method === "POST" && req.url === "/books") {
    let body = [];
    req.on("data", (chunk) => {
      body.push(chunk);
    });
    req.on("end", () => {
      const parsedBody = Buffer.concat(body).toString();
      const [titleParsed, authorParsed] = parsedBody.split("&");

      const [title, author] = [
        titleParsed.split("=")[1].split("+").join(" "),
        authorParsed.split("=")[1].split("+").join(" "),
      ];
      if (title?.length < 1 || author?.length < 1) {
        return res.end("kitob nomi yoki muallifi kiritilmadi, qayta harakat qilib ko'ring");
      }
      let newBook = {
        id: 1,
        title,
        author,
      };
      fs.readFile(filePath, "utf-8", (err, data) => {
        if (err) {
          console.error("Error reading file:", err);
          res.writeHead(500, { "Content-Type": "text/plain" });
          res.end("Internal Server Error");
          return;
        } else {
          try {
            const jsonData = JSON.parse(data);
            const foundBook = jsonData.find(
              (book) => book.title.toLowerCase() === title.toLowerCase()
            );
            if (foundBook) {
              return res.end("<p>Bu kitob bazada mavjud!, boshqa kitob kiriting:)</p>");
            }

            newBook.id = jsonData.length > 0 ? jsonData[jsonData.length - 1].id + 1 : 1;

            jsonData.push(newBook);
            fs.writeFileSync(filePath, JSON.stringify(jsonData, null, 2), "utf-8");
            res.end("<p>muvaffaqiyatli yangi kitob kiritildi.</p>");
            return;
          } catch (error) {
            console.error("Error parsing JSON:", error);
            res.writeHead(500, { "Content-Type": "text/plain" });
            res.end("Internal Server Error");
            return;
          }
        }
      });
    });
    // method: DELETE
    // desc: delete a book by id
  } else if (req.method === "DELETE" && req.url?.startsWith("/books/")) {
    let bookId = req.url?.split("/")[2];
    // @ts-ignore
    bookId = isNaN(bookId) ? bookId : Number(bookId);
    fs.readFile(filePath, "utf-8", (err, data) => {
      if (err) {
        console.error("Error reading file:", err);
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end("Internal Server Error");
        return;
      } else {
        try {
          let jsonData = JSON.parse(data);
          let len = jsonData.length;

          if (len < 1) {
            return res.end("<p>id bo'yicha ma'lumot topilmadi</p>");
          }

          filteredData = jsonData.filter((book) => book.id !== bookId);

          fs.writeFileSync(filePath, JSON.stringify(filteredData, null, 2), "utf-8");
          res.end("<p>ma'lumot muvaffaqiyatli o'chirildi.</p>");

          return;
        } catch (error) {
          console.error("Error parsing JSON:", error);
          res.writeHead(500, { "Content-Type": "text/plain" });
          res.end("Internal Server Error");
          return;
        }
      }
    });
  } else {
    res.end("<h1>Not Found Page</h1>");
  }
});

const PORT = process.env.PORT || 4000;

server.listen(PORT, () => {
  console.log(`server running on port: ${PORT}`);
});
