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
        
        this.PropagationModel = function(parent) {
			subnecto.BaseModel.call(this, parent);
            this.stop = new subnecto.BooleanModel(this);
            this.stop.value = false;
        };
	
		this.initModelPublishers = function() {
			$('#username-input').keyup(function(e) {
				self.modelContainer.models.user.username.update($(this).val());
			});
            
            $('#btn-access').click(function(e) {
                e.preventDefault();
                self.modelContainer.models.user.access();
            });
            
            $('#btn-stop-propagation').click(function(e) {
                self.modelContainer.models.propagation.stop.update(true);
            });
            
            $('#btn-resume-propagation').click(function(e) {
                self.modelContainer.models.propagation.stop.update(false);
            });
		};
	
		this.initModelSubscribers = function() {
			var userModel = self.modelContainer.models.user;
            
            userModel.on('access', function(model) {
                $('.user-update-events').append('<code>subnectoExampleApp.modelContainer.models.<strong>user:access</strong></code><br>');
            });
            
			userModel.username.on('update', function(model, event) {
                if (self.modelContainer.models.propagation.stop.value) {
                    event.stopPropagation();
                }
				$('.username-result').html('Hello <strong>' + model.value + '</strong>!');
			});
			
			userModel.username.on('update', function(model) {
				$('.username-update-events').append('<code>subnectoExampleApp.modelContainer.models.<strong>user.username:update</strong></code><br>');
			});
			
			userModel.on('update', function(model) {
				$('.user-update-events').append('<code>subnectoExampleApp.modelContainer.models.<strong>user:update</strong></code><br>');
			});
            
            self.modelContainer.models.propagation.stop.on('update', function(model, event) {
                if (model.value) {
                    $('#btn-stop-propagation').addClass('hidden');
                    $('#btn-resume-propagation').removeClass('hidden');
                } else {
                    $('#btn-stop-propagation').removeClass('hidden');
                    $('#btn-resume-propagation').addClass('hidden');
                }
            });
		};
	
	    this.ModelsModel = function(parent) {
	    	subnecto.BaseModel.call(this, parent);
			this.user = new self.UserModel(this);
            this.propagation = new self.PropagationModel(this);
	    	// this.users = new self.UsersModel(this);
	    	// this.products = new self.ProductsModel(this);
	    };
		
		this.ModelContainer = function(parent) {
	    	subnecto.BaseModel.call(this, parent);
			this.models;
		};
	
		this.initModel = function() {
			this.modelContainer = new self.ModelContainer();
			this.modelContainer.models = new self.ModelsModel(this.modelContainer);
			this.initModelSubscribers();
			this.initModelPublishers();
		};
	
	};

	window.subnectoExampleApp = new subnectoExampleApp();
	window.subnectoExampleApp.initModel();
	
})($);