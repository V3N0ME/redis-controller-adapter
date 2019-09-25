const redisAdapter = require("../lib");

class Example {
  constructor() {}

  getAll() {
    return new Promise((resolve, reject) => {
      resolve(["a", "b", "c"]);
    });
  }

  get(id) {
    return new Promise((resolve, reject) => {
      resolve({ url: id });
    });
  }
}

module.exports = redisAdapter.use(new Example(), {
  get: { cacheKey: "example1:{0}" },
  getAll: { cacheKey: "examples1", expiry: 60 }
});
