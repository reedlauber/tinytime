class ApplicationController < ActionController::Base
  protect_from_forgery
  before_filter :check_login
  
  ActiveRecord::Base.include_root_in_json = false
  Time::DATE_FORMATS[:simple_date] = "%Y-%m-%d"

  def check_login
  	@logged_in_user = session[:user]
  	@logged_in = @logged_in_user != nil
    
  	if(@logged_in_user != nil)
  		@logged_in_user.accessed_at = Time.now
  		@logged_in_user.save
  	end
  end

  def require_admin
    unless @logged_in && @logged_in_user.is_admin
      redirect_to "/login"
    end
  end
end
