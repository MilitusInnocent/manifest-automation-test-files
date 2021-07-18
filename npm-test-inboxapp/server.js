const express = require("express");
const path = require("path");
const PORT = process.env.PORT || 5000;

express()
  .use(express.static(path.join(__dirname, "mochawesome-report")))
  .get("*", (req, res) => {
    res.sendFile("mochawesome.html", { root: "mochawesome-report" });
  })
  .listen(PORT, () => console.log(`Listening on ${PORT}`));
