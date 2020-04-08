const express = require("express");

const dbRouter = require("./data/router.js");

const server = express();

server.use(express.json());

server.use("/api/posts", dbRouter);

server.get("/", (req, res) => {
    res.send("We are receiving data");
});

server.listen(4000, () => {
    console.log("\n*** Server Running on http://localhost:4000 ***\n");
});

