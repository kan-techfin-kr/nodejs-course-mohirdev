const fs = require("fs");
const path = require("path");
const inner__dirname = path.join(__dirname, "../");

class NotFound404 {
  constructor() {}

  async main(req, res) {
    res.status(404).sendFile(path.join(inner__dirname, "views", "404.html"));
  }
}

module.exports = new NotFound404();
