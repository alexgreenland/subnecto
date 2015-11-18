(function($) {
	

	window.Subnecto = SubnectoFactory();

	var SubnectoExampleApp = function() {
	
		var self = this;
		
		this.UserModel = function(parent) {
			Subnecto.BaseModel.call(this, parent);
			this.username = new Subnecto.ValueModel(this);
		};
	
		this.initModelPublishers = function() {
			$('#username-input').keyup(function(e) {
				self.superModel.models.user.username.update($(this).val());
			});
		};
	
		this.initModelSubscribers = function() {
			var userModel = self.superModel.models.user;
			Subnecto.SubscriptionService.getInstance().subscribe(userModel.username, 'update', 'show-username', function(model) {
				$('.username-result').html('Hello <strong>' + model.value + '</strong>!');
			});
			
			Subnecto.SubscriptionService.getInstance().subscribe(userModel.username, 'update', 'show-username-events', function(model) {
				$('.username-update-events').append('<code>subnectoExampleApp.superModel.models.<strong>user.currentUser:update</strong></code><br>');
			});
			
			Subnecto.SubscriptionService.getInstance().subscribe(userModel, 'update', 'show-user-events', function(model) {
				$('.user-update-events').append('<code>subnectoExampleApp.superModel.models.<strong>user:update</strong></code><br>');
			});
		};
	
	
	    this.ModelsModel = function(parent) {
	    	Subnecto.BaseModel.call(this, parent);
			this.user = new self.UserModel(this);
	    	// this.users = new self.UsersModel(this);
	    	// this.products = new self.ProductsModel(this);
	    };
	
		this.initModel = function() {
			this.superModel = new Subnecto.SuperModel();
			this.superModel.models = new self.ModelsModel(this.superModel);
			this.initModelPublishers();
			this.initModelSubscribers();
		};
	
	};

	window.subnectoExampleApp = new SubnectoExampleApp();
	window.subnectoExampleApp.initModel();
	
})($);