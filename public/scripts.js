(function () {
  var status = document.getElementById("status");
  var messages = document.getElementById("messages");
  var textarea = document.getElementById("textarea");
  var username = document.getElementById("username");
  var clearBtn = document.getElementById("clear");

  var statusDefault = "";

  var setStatus = function (s) {
    status.textContent = s;

    if (s != statusDefault) {
      setTimeout(() => {
        setStatus(statusDefault);
      }, 4000);
    }
  };

  var socket = io.connect("http://localhost:4000");

  if (socket !== undefined) {
    console.log("Connecting to socket...");

    socket.on("output", function (data) {
      if (data.length) {
        for (var i = 0; i < data.length; i++) {
          var message = document.createElement("div");
          message.setAttribute("class", "chat-message");
          message.textContent = data[i].name + ": " + data[i].message;
          // messages.appendChild(message);
          messages.insertBefore(message, messages.firstChild);
        }
      }
    });

    socket.on("status", function (data) {
      setStatus(typeof data === "object" ? data.message : data);

      if (data.clear) {
        textarea.value = "";
      }
    });

    textarea.addEventListener("keydown", function (event) {
      if (event.which == 13 && event.shiftKey == false) {
        socket.emit("input", {
          name: username.value,
          message: textarea.value,
        });
      }
    });

    clearBtn.addEventListener("click", function () {
      console.log("working");
      socket.emit("clear");
    });

    socket.on("cleared", function () {
      messages.textContent = "";
    });
  }
})();
