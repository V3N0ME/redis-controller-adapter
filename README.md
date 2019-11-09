A plug and play redis adapter for controllers. Creates cache keys and verifys them dynamically. All you have to do is configure the format of the cache key for each function

## Installation

```bash
$ npm install redis-controller-adapter
```

## Usage Example

### Initialisation

```js
const redis = require("redis").createClient();
const redisAdapter = require("redis-controller-adapter");
//initialise adapter with the redis client
redisAdapter.init(redis);
//set default expiry date for all keys
//can be overridden by providing induvidual expire time for each cache key in config
redisAdapter.setDefaultExpiry(60);
```

### Usage

```js
//controller/example.js
const redisAdapter = require("redis-controller-adapter");

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
  get: { cacheKey: "example:{0}" },
  getAll: { cacheKey: "examples", expiry: 20 }
});
```
```js
//index.js
const controller = require('./controller/example');
const data = await controller.get('test');

//data.isCached() returns true if the data was retrieved from redis and false if retrieved from the controller
console.log(data, data.isCached());
```

### Configuration

The name of the controller's method which requires caching will be the key and an object containing the format of the cache key and it's expiry (optional) will be the value.

```js
const config = {
  get: { cacheKey: "example:{0}" },
  getAll: { cacheKey: "examples", expiry: 20 }
};
```

#### Example

>**Key** - example:{0}:{1}    
>**Function** - get(id, value)                
>calling **controller.get(1, 2)** will produce **example:1:2**