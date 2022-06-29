const { Collection } = require("discord.js");

class CacheManager {
    constructor() {
        this.cache = new Collection();
    }
    
    /*
    set(key, value) {
        this.cache.set(key, value);
    }
    
    get(key) {
        return this.cache.get(key);
    }
    
    has(key) {
        return this.cache.has(key);
    }
    
    delete(key) {
        return this.cache.delete(key);
    }
    */

    isCacheExpired(item) {
		return ((item.timestamp instanceof Date ? item.timestamp.getTime() : new Date(0)) + this.ttl) > Date.now();
	}

	setCache(settings) {
		if (settings) {
			settings.expiry = new Date();
			this.cache.set(settings.guildID, settings);
            console.log("Cached Data " + settings.guildID);
		}
	}

	collection() {
		return this.cache;
	}

	async getAll() {
		const allSettings = await this.model.find({});

		allSettings.forEach(this.setCache, this);
		return allSettings;
	}

	fetch(id) {
		return this.model.findById(id);
	}

	async save(value = {}) {
		if (typeof value.save == 'function') {
			return value.save()
				.then(res => {
					this.setCache(res);
					return res;
				});
		}
		if (typeof value._id == 'string') {
			return this.model.findByIdAndUpdate(value._id, value)
				.then(res => {
					this.setCache(res);
					return res;
				});
		}
		return value;
	}
}

module.exports = CacheManager;
