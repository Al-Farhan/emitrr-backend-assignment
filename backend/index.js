import "dotenv/config";
import { Server } from "socket.io";
import { createServer } from "http";
import { usersTable } from "./models/user.model.js";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";

const PORT = process.env.PORT || 3500;

const db = drizzle(process.env.DATABASE_URL);

const httpServer = createServer();

const io = new Server(httpServer, {
  cors: {
    origin:
      process.env.NODE_ENV === "production"
        ? false
        : [
            "http://localhost:5173",
            "http://127.0.0.1:5173",
            "https://fourinrow.vercel.app",
            "https://fourinrow.farhanshaikh.life",
          ],
  },
});

const allUsers = {};

io.on("connection", (socket) => {
  console.log(`User ${socket.id} connected`);

  allUsers[socket.id] = {
    socket: socket,
    online: true,
  };

  socket.on("request_to_play", async (data) => {
    // Find user
    try {
      const [myUser] = await db
        .select()
        .from(usersTable)
        .where((table) => eq(table.userName, data.playerName))
        .limit(1);

      if (!user || user.length === 0) {
        await db.insert(usersTable).values({ userName: data.playerName });
      }
    } catch (error) {
      console.log(error);
    }

    const currentUser = allUsers[socket.id];
    currentUser.playerName = data.playerName;

    let opponentPlayer;
    for (const key in allUsers) {
      const user = allUsers[key];
      if (user.online && !user.playing && socket.id !== key) {
        opponentPlayer = user;
        break;
      }
    }

    if (opponentPlayer) {
      currentUser.socket.emit("opponentFound", {
        opponentName: opponentPlayer.playerName,
        playingAs: "yellow",
      });

      opponentPlayer.socket.emit("opponentFound", {
        opponentName: currentUser.playerName,
        playingAs: "red",
      });

      // player move
      currentUser.socket.on("playerMoveFromClient", (data) => {
        opponentPlayer.socket.emit("playerMoveFromServer", {
          ...data,
        });
      });

      opponentPlayer.socket.on("playerMoveFromClient", (data) => {
        currentUser.socket.emit("playerMoveFromServer", {
          ...data,
        });
      });
    } else {
      currentUser.socket.emit("opponentNotFound");
    }
  });

  socket.on("disconnect", function () {
    const currentUser = allUsers[socket.id];
    currentUser.online = false;
  });
});

httpServer.listen(PORT, () => console.log(`listening on port ${PORT}`));
