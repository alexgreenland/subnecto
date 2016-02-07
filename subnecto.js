/*
 * Copyright 2016 Alex Greenland
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
(function() {
	var Subnecto = function(options) {
		var uuid;
		
		if (typeof window === 'object') {
			uuid = window.uuid;
		}
		
		if (typeof module === 'object' && module.exports) {
			uuid = require('node-uuid');
		}
		
		var self = this;
		this.version = '0.0.2';
		
		if (options) {
			this.idGeneratorType = options.idGeneratorType;
		}
		
		this.subscriptionService;
		
		var generateRandom = function() {
			var returner = '';
			var crypto;
			if (typeof window === 'object') {
				crypto = window.crypto || window.msCrypto;
			}
			if (crypto) {
				var length = 4;
				var typedArray = new Uint32Array(length);
				crypto.getRandomValues(typedArray);
				array = [].slice.call(typedArray);
				array.forEach(function(item) {
					returner += item.toString(16);
				});
			} else {
				var max = 100000000;
				var min = 0;
				returner = Math.round(Math.random() * (max - min) + max).toString(16);
			}
			returner += new Date().getTime();
			return returner;
		}
		
		this.generateId = function(type) {
			var idGeneratorType = type || this.idGeneratorType;
			if (idGeneratorType && idGeneratorType === 'uuid') {
				return uuid.v4();
			} else {
				return generateRandom();
			}
		};
		
	    this.SubscriptionService = function() {
	    	this.subscribers = {};

	    	this.subscribe = function(model, event, func) {
				// Subscribe to events on the model. Store at the key.
				if (!this.subscribers[model.id]) {
					this.subscribers[model.id] = {};
				}

				if (!this.subscribers[model.id][event]) {
					this.subscribers[model.id][event] = [];
				}

				this.subscribers[model.id][event].push(func);
	    	};

	    	this.push = function(model, event) {
				// Push the model event to the subscribers,
				// and bubble up the hierarchy chain
	    		var self = this;
	    		var currentModel = model;
	    		do {
	    			var modelSubscribers = self.subscribers[currentModel.id];
	    			if (!modelSubscribers) {
	    				continue;
	    			}
	    			var modelEventSubscribers = modelSubscribers[event];
					if (!modelEventSubscribers) {
	    				continue;
	    			}

	    			modelEventSubscribers.forEach(function(func) {
						func(currentModel);
	    			});
	    		} while (currentModel = currentModel.parent);
	    	};
	    };
		
	    this.SubscriptionService.getInstance = function() {
			// Singleton
    		if (!this.subscriptionService) {
    			this.subscriptionService = new self.SubscriptionService();
    		}
    		return this.subscriptionService;
    	};
		
	    this.BaseModel = function(parent) {
			// The root of all models.
	    	this.id = self.generateId();
	    	this.parent = parent;
			
			this.on = function(event, func) {
				// Helper for Subscription Service event listening.
				self.SubscriptionService.getInstance().subscribe(this, event, func);	
			};

	    	this.push = function(event) {
				// Push the model event.
	    		self.SubscriptionService.getInstance().push(this, event);
	    	};
			
	    	this.stringify = function(removeIds, replacer) {
				// JSON serialisation with circular references removed.
	    		return JSON.stringify(this, function(key, value) {
	    			if (key === 'parent') {
	    				return undefined;
	    			}
					
					if (removeIds && key === 'id') {
						return undefined;
					}
					
					if (typeof replacer === 'function') {
						return replacer(key, value);
					}
					
	    			return value;
	    		});
	    	};
			
			// Model instance created event
	    	this.push('create');
	    };
		
	    this.ValueModel = function(parent) {
			// Primitive value model.
	    	self.BaseModel.call(this, parent);
	    	this.value;

	    	this.update = function(value) {
	    		this.value = value;
	    		this.push('update');
	    	};
	    };
		
		this.ArrayModel = function(parent, type) {
			// Composite model; array can be typed.
	    	self.BaseModel.call(this, parent);
	    	this.type = type;
	    	this.value = [];

	    	this.update = function(array) {
				// Replace array.
	    		if (Array.isArray(array)) {
	    			this.value = array;
	    			this.push('update');
	    		}
	    	};

	    	this.updateAt = function(index, content) {
				// Update array at index.
	    		if (this.type) {
	    			var model = this.value[index];
	    			model.update.apply(model, content);
	    		} else {
	    			this.value[index] = content;
	    			this.push('update');
	    		}
	    	};

	    	this.add = function() {
				// Add to array.
    			if (arguments.length === 0) {
    				return;
    			}

	    		if (this.type) {
	    			var args;
	    			if (arguments.length === 1 && Array.isArray(arguments[0])) {
	    				args = arguments[0];
	    			} else {
	    				args = underscore.toArray(arguments);
	    			}
		    		var model = new this.type(this);
					
					// Call the update on the specific model.
		    		model.update.apply(model, args);
		    		this.value.push(model);
	    		} else {
	    			this.value.push(arguments[0]);
	    			this.push('update');
	    		}
	    		this.push('add');
	    	};

	    	this.updateFromString = function(string) {
				// Replace array with parsed semicolon-separated string.
	    		this.update(string.split(';'));
	    	};
	    };
		
		// Model representing `true` and `false` values.
	    this.BooleanModel = function(parent) {
	    	self.BaseModel.call(this, parent);
	    	this.value = false;
	    	this.update = function(value) {
	    		if (typeof(value) === 'boolean') {
	    			this.value = value;
	    			this.push('update');
	    		}
	    	};
	    };
	
	};
	
	if (typeof module === 'object' && module.exports) {
		module.exports = Subnecto;	
	}
	
	if (typeof window === 'object') {
		window.Subnecto = Subnecto;
	}
})();