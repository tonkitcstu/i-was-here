import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";

import { getPhotoCard } from "./app/api/strapi";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3001;
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handler);

  const io = new Server(httpServer);

  io.on("connection", async (socket) => {
    let photoCards = [];

    const { data } = await getPhotoCard();
    for (let i = 0; i < data.length; i++) {
      const photoCardAttr = data[i].attributes;

      const message = photoCardAttr.message;
      let coverImageSrc = "";
      if (photoCardAttr.coverImage) {
        coverImageSrc =
          process.env.NEXT_PUBLIC_STRAPI_HOST +
          photoCardAttr.coverImage.data.attributes.url;
      }
    }

    while (true) {
      socket.emit("hello", "world");
      await new Promise((r) => setTimeout(r, 2000));
    }
  });

  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});
