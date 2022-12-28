const appExpress = require("./app");
const debug = require("debug")("node-angular");
const http = require("http");

const onError = (error: any) => {
  if (error.syscall !== "listen") {
    throw error;
  }
  const bind = typeof port === "string" ? "pipe " + port : "port " + port;
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);

    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);

    default:
      throw error;
  }
};

const onListening = () => {
  const addr = server.address();
  const bind = typeof port === "string" ? "pipe " + port : "port " + port;
  console.log("Listening on " + bind);
};

const port = "3000";
appExpress.set("port", port);

const server = http.createServer(appExpress);
server.on("error", onError);
server.on("listening", onListening);

server.listen(port);
