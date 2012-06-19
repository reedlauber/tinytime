  class TokenController < ApplicationController
  before_filter :initialize_controller
  
  private

  def provision_user
  	@user = User.new
  	@user.username = User.generate_unique_username
  	@user.save(:validate => false)
  	cookies[:username] = { :value => @user.username, :expires => 1.year.from_now }
  end

  def provision_instance
  	@instance = Instance.new
  	@instance.user_id = @user.id
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
    else
      @user = @logged_in_user
      @username = @logged_in_user.username
    end

    # process user and instance info from GET params
    if (params[:username] == nil)
    	# If there's no username param, check if there was a logged in user or saved cookie value
    	if(@user != nil)
        # Get recent projects
        @user_instances = Instance.where("user_id = ?", @user.id).order("updated_at DESC").limit(10)
        if(@user_instances.count > 0)
          last_instance = @user_instances[0]
          redirect_to "/#{@username}/#{last_instance.slug}/#{last_instance.token}"
        else
      		redirect_to "/new"
        end
    	else
    		# If no saved cookie, create a new user, and instance and go there
    		provision_user
    		provision_instance
    		@username = @user.username
    		redirect_to "/#{@username}/#{@instance.slug}/#{@instance.token}"
    	end
    else
    	# We have a username param. check if it's valid
      @username = params[:username]

      if(@username == "new")
        # User requested a new timesheet
        if(@logged_in) # If the user is logged in, create a new timesheet for that user
          @user = @logged_in_user
        elsif(cookies[:username] != nil) # If there is a username in a cookie, look for a previously created account
          @user = User.where("username = ?", cookies[:username]).first
          # If there wasn't an account, or if the account has a password (cookies are no longer valid for it), create a new one
          if(@user == nil || @user.password != nil)
            provision_user
          end
        else # No logged in user or cookie. Just create a new user
          provision_user
        end
        provision_instance
        redirect_to "/#{@user.username}/#{@instance.slug}/#{@instance.token}"
      else
        @user = User.where("username = ?", @username).first

        if(@user == nil)
          # A specific user was given, but not found. bad request
          render "home/notfound"
        elsif(params[:slug] == nil)
          # Found a user, but no instance specified.
          render "home/index"
        else
          # user and instance given. look for specified instance.
          @username = @user.username
          @instance = Instance.where("slug = ?", params[:slug]).first
          if(@instance == nil)
            # Specified instance is not valid. bad request
            render "home/notfound"
          else
            @slug = @instance.slug
            @token = @instance.token
            @editable = @token == params[:token]
            if(!@editable)
              render "home/timesheet"
            end
            # get recent projects
            @user_instances = Instance.where("user_id = ?", @user.id).order("updated_at DESC").limit(10)
          end
        end
      end

    end
  end
end