const format = require("string-template");

module.exports = {
  init: redis => {
    this.redis = redis;
  },

  use: (controller, config) => {
    for (let key in config) {
      const func = controller[key];

      controller[key] = (...args) => {
        return new Promise((resolve, reject) => {
          try {
            const formattedKey = format(config[key], args);
            this.redis.get(formattedKey, async (err, cachedData) => {
              if (err) {
                reject(err);
                return;
              }
              if (cachedData !== null) {
                resolve({ status: "cached", data: JSON.parse(cachedData) });
                return;
              }

              const newData = await func(...args);
              resolve({ status: "live", data: newData });
              this.redis.set(formattedKey, JSON.stringify(newData));
            });
          } catch (err) {
            reject(err);
          }
        });
      };
    }

    return controller;
  }
};
