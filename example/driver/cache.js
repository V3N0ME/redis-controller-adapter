const redis = require("redis");

const client = redis.createClient({
  host: "localhost",
  port: 6379
});

client.on("connect", err => {
  console.log("Redis Connected");
});

client.on("error", function(err) {
  //console.log("Error " + err);
});

module.exports = client;
