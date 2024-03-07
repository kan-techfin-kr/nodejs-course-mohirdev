const fs = require("fs");
const path = require("path");
const inner__dirname = path.join(__dirname, "../");

class MainTest {
  constructor() {}

  async mainTest(req, res) {
    res.sendFile(path.join(inner__dirname, "views", "test.html"));
  }
}

module.exports = new MainTest();
