# subnecto

A lightweight, extensible and reactive model-driven library. Model events can be subscribed to, and bubble up the hierarchy chain.

[Demo](http://alexgreenland.com/subnecto/)

## Setup

### Node

	// Subnecto constructor
	var Subnecto = require('subnecto');
	
	// A Subnecto instance
	var subnecto = new Subnecto();

### Browser

	<script src="subnecto.js"></script>
	<script>
		window.subnecto = new Subnecto();
	</script>

## Usage

Create your models derived from the Subnecto models.

	var UserModel = function(parent) {
		subnecto.BaseModel.call(this, parent);
		this.username = new subnecto.ValueModel(this);
	};

Create a model container to hold your models, for example:

    var ModelsModel = function(parent) {
    	subnecto.BaseModel.call(this, parent);
		this.user = new UserModel(this);
    };

Publishers are responsible for pushing changes to the models. Bind your publishers to model functions, using a DOM library of your choice.

	var initModelPublishers = function() {

	};
	
Subscribers respond to model events. Bind your subscribers to model functions, using a DOM library of your choice.

	var initModelSubscribers = function() {
		
	};

Instantiate and initialise the model. We have made a container as the top-level model to hold our models.
	    
    var ModelContainer = function() {
        this.models;
    }; 
        
	var initModel = function() {
    	var modelContainer = new ModelContainer();
    	modelContainer.models = new ModelsModel(modelContainer);
    	initModelPublishers();
    	initModelSubscribers();
    };


## License

Apache License 2.0