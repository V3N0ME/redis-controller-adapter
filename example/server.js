const http = require("http");
const redis = require("../driver/cache");
const redisAdaptor = require("../lib/redisAdaptor");
const controller = require("./controller");

redisAdaptor.init(redis);

http
  .createServer(async (req, res) => {
    res.json = json => {
      res.write(JSON.stringify(json));
    };

    res.writeHead(200, { "Content-Type": "application/json" });

    try {
      let data = null;

      if (req.url === "/") {
        data = await controller.getAll();
      } else {
        data = await controller.get(req.url);
      }

      res.json({ code: 200, data: data });
    } catch (err) {
      res.json({ code: 500, msg: err.toString() });
    }

    res.end();
  })
  .listen(1234);
