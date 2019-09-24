const redisAdapter = require("../lib/redisAdaptor");

class Product {
  constructor() {}

  getAll() {
    return new Promise((resolve, reject) => {
      resolve(["a", "b", "c"]);
    });
  }

  get(id) {
    return new Promise((resolve, reject) => {
      resolve(id);
    });
  }
}

module.exports = redisAdapter.use(new Product(), {
  get: "user:{0}",
  getAll: "users"
});
