const format = require("string-template");

module.exports = {
  init: redis => {
    this.redis = redis;
  },

  setDefaultExpiry: expiry => {
    if (isNaN(expiry)) {
      throw "Expiry must be a number";
    }
    this.expiry = expiry;
  },

  use: (controller, config) => {
    for (let key in config) {
      const func = controller[key];

      controller[key] = (...args) => {
        return new Promise((resolve, reject) => {
          try {
            const cacheKey = config[key].cacheKey;
            const expiry =
              config[key].expiry === undefined
                ? this.expiry
                : config[key].expiry;
            const formattedKey = format(cacheKey, args);
            this.redis.get(formattedKey, async (err, cachedData) => {
              if (err) {
                reject(err);
                return;
              }

              // Return from Redis Cache
              if (cachedData !== null) {
                cachedData = JSON.parse(cachedData);
                cachedData.isCached = ()=>{
                  return true;
                };
                resolve(cachedData);
                return;
              }

              // Return from Function
              const newData = await func(...args);
              newData.isCached = ()=>{
                return false;
              };
              resolve(newData);

              // If Expiry Exist
              if (expiry) {
                this.redis.set(
                  formattedKey,
                  JSON.stringify(newData),
                  "EX",
                  expiry
                );
              } else {
                this.redis.set(formattedKey, JSON.stringify(newData));
              }
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
