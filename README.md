# subnecto

A lightweight, extensible and reactive model-driven library. Model events can be subscribed to, and bubble up the hierarchy chain.

# Usage

Bind `subnecto` to your desired namespace through the Subnecto factory function `SubnectoFactory`.

	<script src="../subnecto.js"></script>
	<script>
		window.Subnecto = SubnectoFactory();
	</script>

Create your models derived from the Subnecto models.

	this.UserModel = function(parent) {
		Subnecto.BaseModel.call(this, parent);
		this.username = new Subnecto.ValueModel(this);
	};

Create a model container to hold your models, for example:

    this.ModelsModel = function(parent) {
    	Subnecto.BaseModel.call(this, parent);
		this.user = new self.UserModel(this);
    };

Publishers are responsible for pushing changes to the models. Bind your publishers to model functions, using a DOM library of your choice.

	var initModelPublishers = function() {

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