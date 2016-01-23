var Subnecto = require('../lib/subnecto');
var subnecto = new Subnecto();

describe('Subnecto', function() {
	it('is a constructor function', function() {
		expect(Subnecto).toEqual(jasmine.any(Function));
	});
});

describe('subnecto', function() {
	it('has a base model', function() {
		expect(subnecto.BaseModel).toBeDefined();
	});
});