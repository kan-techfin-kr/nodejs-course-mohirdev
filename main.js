const express = require("express");

class NodeServer {
  constructor() {
    this.app = express();
    this.mainTestController = require("./controller/MainTest");
    this.notFount404Controller = require("./controller/NotFound404");
    this.setupEnvironment();
  }
  setupEnvironment() {
    this.PORT = process.env.PORT || 4000;
    this.configureExpress();
  }
  configureExpress() {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));
    this.setupAllRoutes();
  }
  setupAllRoutes() {
    this.app.get("/", this.mainTestController.mainTest);
    this.app.use("/", require("./routes"));
    this.app.all("*", this.notFount404Controller.main);
    this.startServer();
  }
  startServer() {
    this.app.listen(this.PORT, () => {
      console.log(`Server is running on port: ${this.PORT}`);
    });
  }
}

new NodeServer();
