const http = require("http");
const fs = require("fs");
const path = require("path");

const fileName = "db.json";
const filePath = path.join(__dirname, fileName);

const server = http.createServer(function (req, res) {
  if (req.url === "/" && req.method === "GET") {
    res.end("<h1>nodejs is working perfectly...</h1>");
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
  } else if (req.method === "GET" && req.url === "/create-book") {
    res.end(`
    <html>
        <body>
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
  } else if (req.method === "POST" && req.url === "/books") {
    let body = [];
    req.on("data", (chunk) => {
      body.push(chunk);
    });
    req.on("end", () => {
      const parsedBody = Buffer.concat(body).toString();
      const [titleParsed, authorParsed] = parsedBody.split("&");
      console.log("titleParsed: ", titleParsed);
      console.log("authorParsed: ", authorParsed);
      const [title, author] = [
        titleParsed.split("=")[1].split("+").join(" "),
        authorParsed.split("=")[1].split("+").join(" "),
      ];
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
  } else {
    res.end("<h1>Not Found Page</h1>");
  }
});

const PORT = process.env.PORT || 4000;

server.listen(PORT, () => {
  console.log(`server running on port: ${PORT}`);
});
