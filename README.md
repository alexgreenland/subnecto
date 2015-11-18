# subnecto

A lightweight, extensible and reactive model-driven library. Model events can be subscribed to, and bubble up the hierarchy chain.

# Usage

Bind `subnecto` to your desired namespace through the Subnecto factory function `SubnectoFactory`.

	<script src="../subnecto.js"></script>
	<script>
		window.subnecto = SubnectoFactory();
	</script>

Create your models derived from the Subnecto models.

Create a model container to hold your models, for example:

	    var ModelsModel = function(parentParam) {
	    	BaseModel.call(this, parentParam);
	    	this.users = new UsersModel(this);
	    	this.products = new ProductsModel(this);
	    };

Publishers are responsible for pushing changes to the models. Bind your publishers to model functions, using a DOM library of your choice.

	var initModelPublishers = function() {
		$('.users')
	};
	
Subscribers respond to model events. Bind your subscribers to model functions, using a DOM library of your choice.

	var initModelSubscribers = function() {
		
	};


Instantiate and initialise the model. The `SuperModel` is the Subnecto model container, and is intended to be the container of your models container, `ModelsModel`.
	    
		var initModel = function() {
	    	var superModel = new SuperModel();
	    	superModel.models = new ModelsModel(this.superModel);
	    	initModelPublishers();
	    	initModelSubscribers();
	    };



## License

Apache License 2.0