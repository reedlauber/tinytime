class ApplicationController < ActionController::Base
  protect_from_forgery
  before_filter :check_login
  
  ActiveRecord::Base.include_root_in_json = false
  Time::DATE_FORMATS[:simple_date] = "%Y-%m-%d"

  def check_login
  	@logged_in_user = session[:user]
  	@logged_in = @user != nil
  	if(@logged_in_user != nil)
  		@logged_in_user.accessed_at = Time.now
  		@logged_in_user.save
  	end
  end
end
