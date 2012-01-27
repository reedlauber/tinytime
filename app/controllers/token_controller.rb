class TokenController < ApplicationController
  before_filter :initialize_controller
  
  private

  def provision_user
  	@user = User.new
  	@user.username = User.generate_unique_username
  	@user.save
  	cookies[:username] = { :value => @user.username, :expires => 1.year.from_now }
  end

  def provision_instance user_id
  	@instance = Instance.new
  	@instance.user_id = user_id
  	@instance.slug = Instance.generate_unique_token
  	@instance.token = Instance.generate_token
  	@instance.save
  end

  def initialize_controller
    @slug = ""
    @token = ""
    @editable = false

    if (@logged_in_user == nil)
      # read previous user from cookie
      @username = cookies[:username]
      if (@username != nil)
        @user = User.where("username = ?", @username).first      
      end
    end

    # process user and instance info from GET params
    if (params[:username] == nil)
    	# if there's no username param, check if there was a saved cookie value
    	if(@user != nil)
        # get recent projects
        @user_instances = Instance.where("user_id = ?", @user.id).order("updated_at DESC").limit(10)
        if(@user_instances.count > 0)
          last_instance = @user_instances[0]
          redirect_to "/#{@username}/#{last_instance.slug}/#{last_instance.token}"
        else
      		redirect_to "/#{@username}"
        end
    	else
    		# if no saved cookie, create a new user, and instance and go there
    		provision_user
    		provision_instance @user.id
    		@username = @user.username
    		redirect_to "/#{@username}/#{@instance.slug}/#{@instance.token}"
    	end
    else
    	# we have a username param. check if it's valid
    	@username = params[:username]
    	@user = User.where("username = ?", @username).first

    	if(@user == nil)
    		# didn't find user. bad request
    		render "home/notfound"
    	elsif(params[:slug] == nil)
    		# found a user, but no instance specified. create a new instance and go there
    		provision_instance @user.id
    		redirect_to "/#{@user.username}/#{@instance.slug}/#{@instance.token}"
    	else
    		# user and instance given. look for specified instance.
    		@username = @user.username
    		@instance = Instance.where("slug = ?", params[:slug]).first
    		if(@instance == nil)
    			# specified instance is not valid. bad request
    			render "home/notfound"
    		else
      		@slug = @instance.slug
      		@token = @instance.token
          @editable = @token == params[:token]
          # get recent projects
          @user_instances = Instance.where("user_id = ?", @user.id).order("updated_at DESC").limit(10)
        end
    	end
    end
  end
end