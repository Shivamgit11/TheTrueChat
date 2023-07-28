const path = require("path");
const sgMail = require("@sendgrid/mail");
const express = require("express");
const bodyParser = require("body-parser");
const sequelize = require("./util/database");
const compression = require("compression");
const socketio = require("socket.io");
const fs = require("fs");
const http = require("http");
const cron = require("node-cron");

const app = express();

const Chat = require("./models/Chat");
const Auth = require("./models/Auth");
const Group = require("./models/group");
const ArchievedMessage = require("./models/ArchievedChat");
const server = http.createServer(app); // create a server instance
const io = socketio(server); // initialize socket.io
// app.set("view engine", "ejs");
// app.set("views", "views");
const multer = require("multer");
const upload = multer();

const authRoutes = require("./routes/auth");

const chatRoutes = require("./routes/chat");

const grouproute = require("./routes/group");
const fileRoutes = require("./routes/group-files");

// const Forgotpassword = require("./models/forgetpassword");

app.use(compression());
const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "access.log"),
  { flags: "a" }
);

const resetPasswordRoutes = require("./routes/resetPassword");
var cors = require("cors");

const dotenv = require("dotenv");

// get config vars
dotenv.config();

app.use(cors());

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

//expense

app.use("/auth", authRoutes);
app.use("/chat", chatRoutes);

app.use("/password", resetPasswordRoutes);

app.use("/group", grouproute);
app.use("/file", upload.single("myfile"), fileRoutes);

app.use((req, res) => {
  console.log("just chill buddyfault", req.originalUrl);
  res.sendFile(path.join(__dirname, `public/${req.url}`));
});

console.log("i am ");

//working for expense backend

Auth.hasMany(Chat);
Chat.belongsTo(Auth);

// Group

Auth.hasMany(Group);
Group.belongsTo(Auth);

Group.hasMany(Chat);
Chat.belongsTo(Group);

Auth.hasMany(ArchievedMessage);
Group.hasMany(ArchievedMessage);

///everty thing for expense will be done inside it

sequelize
  .sync({ alter: true })
  .then(() => {
    server.listen(3000, () => {
      console.log("server is listening");
    });

    io.on("connect", (socket) => {
      console.log("user connected");
      console.log(socket.id);
      socket.on("custom-event", (number, string, obj) => {
        console.log(number, string, obj);
      });
      socket.on("send-message", (msg) => {
        console.log("aa gye kya bro");
        console.log(msg);
        io.emit("receivedMsg", msg);
      });

      socket.on("send-group", () => {
        console.log("aa gela ki line no 99 pe ");
        io.emit("receivedchat");
      });
    }); //send-message
    cron.schedule("0 0 * * *", async () => {
      try {
        const chats = await Chat.findAll();
        console.log("chats *********", chats);

        for (const chat of chats) {
          await ArchievedMessage.create({
            groupId: chat.groupId,
            authId: chat.authId,
            message: chat.message,
          });
          console.log("id hai yaar", chat.id);
          await Chat.destroy({ where: { id: chat.id } });
        }

        console.log("Running cron job...");
      } catch (error) {
        console.error("Error occurred while processing chats:", error);
      }
    });
  })
  .catch((err) => {
    console.log(err);
  });
