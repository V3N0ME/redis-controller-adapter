const format = require('string-template');

module.exports = {

	init: (redis)=>{

		this.redis = redis;
	},

	use: (controller, config)=> {
	
		for(let key in config) {

			const temp = controller[key];

			controller[key] = (...args)=>{

				return new Promise(async (resolve, reject)=>{

					try {

						const formattedKey = format(config[key], args);
						const data = await this.redis.get(formattedKey);

						if(data !== null) {
							resolve(data);
							return;
						}

						const newData = await temp(...args);
						resolve(newData);
						this.redis.put(formattedKey, JSON.stringify(newData));
					}
					catch(err) {

						reject(err);
					}

				});	
			};
		}

		return controller;
	}
}