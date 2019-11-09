const redis = require("redis");

const client = redis.createClient({
  host: "localhost",
  port: 6379
});

client.on("connect", err => {
  console.log("Redis Connected");
});

client.on("error", err=> {
  console.log(err);
  process.exit(1);
});

module.exports = client;
