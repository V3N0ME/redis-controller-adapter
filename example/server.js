const http = require("http");
const util = require("util");
const redis = require("../driver/cache");
const redisAdaptor = require("../lib");
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
      } else if (req.url === "/keys") {
        const getKeys = util.promisify(redis.keys).bind(redis);
        data = await getKeys("*");
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

console.log("Server running on port " + 1234);
