const express = require("express");
const mongoose = require("mongoose");
const socket = require("socket.io");
const Chat = require("./model/Chat");

const app = express();

app.use(express.static(__dirname + "/public"));

mongoose
  .connect(
    "ADD_IN_YOUR_MONGOURI",
    {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("Database connected");
  })
  .catch((err) => {
    console.log("Database error");
  });

const expressServer = app.listen(4000, () => {
  console.log("Listening on port 4000");
});

const client = socket(expressServer);

client.on("connection", async function (socket) {
  const sendStatus = function (s) {
    socket.emit("status", s);
  };

  const output = await Chat.find({}).limit(100).sort({ _id: 1 });

  socket.emit("output", output);

  socket.on("input", async function (data) {
    let name = data.name;
    let message = data.message;

    if (name == "" || message == "") {
      sendStatus("Please enter a name and message");
    } else {
      await Chat.create({
        name: name,
        message: message,
      });
      client.emit("output", [data]);
      sendStatus({
        message: "Message sent",
        clear: true,
      });
    }
  });

  socket.on("clear", async function (data) {
    await Chat.deleteMany({});
    socket.emit("cleared");
  });
});
