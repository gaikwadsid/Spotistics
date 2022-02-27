const express = require("express");
const app = express()

const PORT = 4000

app.use(express.static("static"))

app.post("/search-tracks", (req, res)=>{
  res.send("hi!")
})

app.listen(PORT, ()=>{
  console.log(`Listening on port ${PORT}!`)
})
