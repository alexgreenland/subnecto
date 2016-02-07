var Subnecto = require('../subnecto');

describe('Subnecto', function() {
	it('is a constructor function', function() {
		expect(Subnecto).toEqual(jasmine.any(Function));
	});
});

describe('subnecto', function() {
	it('has the version identifier', function() {
		var subnecto = new Subnecto();
		expect(subnecto.version).toEqual('0.0.2');
	});
	
	it('generates a unique ID', function() {
		var subnecto = new Subnecto();
		expect(subnecto.generateId()).not.toEqual(subnecto.generateId());
	});
	
	it('generates a unique ID (UUID)', function() {
		var subnecto = new Subnecto();
		expect(subnecto.generateId('uuid')).not.toEqual(subnecto.generateId('uuid'));
	});
	
	it('has a base model', function() {
		var subnecto = new Subnecto();
		expect(subnecto.BaseModel).toBeDefined();
	});
	
	it('can stringify a model', function() {
		var subnecto = new Subnecto({
			idGeneratorType: 'uuid'
		});
		
		var Model = function(parent) {
			subnecto.BaseModel.call(this, parent);
			this.text = new subnecto.ValueModel(this);
		};
		
		var Models = function(parent) {
			subnecto.BaseModel.call(this, parent);
			this.model = new Model(this);
		};
		
		var models = new Models();
		models.model.text.update('Hello World');
		
		var jsonString = models.stringify();
		expect(jsonString).toEqual(jasmine.any(String));
		
		var jsObject = JSON.parse(jsonString);
		expect(jsObject.model.text.id).toBeDefined();
		expect(jsObject.model.text.value).toEqual('Hello World');
	});
	
	it('can stringify a model without IDs', function() {
		var subnecto = new Subnecto({
			idGeneratorType: 'uuid'
		});
		
		var Model = function(parent) {
			subnecto.BaseModel.call(this, parent);
			this.text = new subnecto.ValueModel(this);
		};
		
		var Models = function(parent) {
			subnecto.BaseModel.call(this, parent);
			this.model = new Model(this);
		};
		
		var models = new Models();
		models.model.text.update('Hello World');
		
		var jsonString = models.stringify(true);
		expect(jsonString).toEqual(jasmine.any(String));
		
		var jsObject = JSON.parse(jsonString);
		expect(jsObject.model.text.id).not.toBeDefined();
		expect(jsObject.model.text.value).toEqual('Hello World');
	});
	
	it('can stringify a model with no IDs and a custom replacer', function() {
		var subnecto = new Subnecto({
			idGeneratorType: 'uuid'
		});
		
		var Model = function(parent) {
			subnecto.BaseModel.call(this, parent);
			this.text = new subnecto.ValueModel(this);
			this.example = new subnecto.ValueModel(this);
		};
		
		var Models = function(parent) {
			subnecto.BaseModel.call(this, parent);
			this.model = new Model(this);
			this.example = new subnecto.ValueModel(this);
		};
		
		var models = new Models();
		models.model.text.update('Hello World');
		models.model.example.update('Example 1');
		models.example.update('Example 2');
		
		var jsonString = models.stringify(true, function(key, value) {
			if (key === 'example') {
				return undefined;
			}
			return value;
		});
		
		expect(jsonString).toEqual(jasmine.any(String));

		var jsObject = JSON.parse(jsonString);
		expect(jsObject.model.text.id).not.toBeDefined();
		expect(jsObject.model.example).not.toBeDefined();
		expect(jsObject.example).not.toBeDefined();
		expect(jsObject.model.text.value).toEqual('Hello World');
	});
});