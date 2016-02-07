(function($) {
	
	window.subnecto = new Subnecto({
	});

	var subnectoExampleApp = function() {
	
		var self = this;
		
		this.UserModel = function(parent) {
			subnecto.BaseModel.call(this, parent);
			this.username = new subnecto.ValueModel(this);
            
            this.access = function() {
                this.push('access');
            };
            
		};
	
		this.initModelPublishers = function() {
			$('#username-input').keyup(function(e) {
				self.superModel.models.user.username.update($(this).val());
			});
            
            $('#btn-access').click(function(e) {
                e.preventDefault();
                self.superModel.models.user.access();
            });
		};
	
		this.initModelSubscribers = function() {
			var userModel = self.superModel.models.user;
            
            userModel.on('access', function(model) {
                $('.user-update-events').append('<code>subnectoExampleApp.superModel.models.<strong>user:access</strong></code><br>');
            });
            
			userModel.username.on('update', function(model) {
				$('.username-result').html('Hello <strong>' + model.value + '</strong>!');
			});
			
			userModel.username.on('update', function(model) {
				$('.username-update-events').append('<code>subnectoExampleApp.superModel.models.<strong>user.username:update</strong></code><br>');
			});
			
			userModel.on('update', function(model) {
				$('.user-update-events').append('<code>subnectoExampleApp.superModel.models.<strong>user:update</strong></code><br>');
			});
		};
	
	    this.ModelsModel = function(parent) {
	    	subnecto.BaseModel.call(this, parent);
			this.user = new self.UserModel(this);
	    	// this.users = new self.UsersModel(this);
	    	// this.products = new self.ProductsModel(this);
	    };
		
		this.SuperModel = function(parent) {
	    	subnecto.BaseModel.call(this, parent);
			this.models;
		};
	
		this.initModel = function() {
			this.superModel = new self.SuperModel();
			this.superModel.models = new self.ModelsModel(this.superModel);
			this.initModelSubscribers();
			this.initModelPublishers();
		};
	
	};

	window.subnectoExampleApp = new subnectoExampleApp();
	window.subnectoExampleApp.initModel();
	
})($);