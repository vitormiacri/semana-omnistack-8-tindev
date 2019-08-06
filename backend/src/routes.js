const express = require("express");

const routes = express.Router();

server.get("/", (req, res) => {
	return res.send("Hello world");
});

module.exports = {
	routes
};
