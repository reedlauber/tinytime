class ApplicationController < ActionController::Base
  protect_from_forgery
  before_filter :ensure_token
  
  ActiveRecord::Base.include_root_in_json = false
  Time::DATE_FORMATS[:simple_date] = "%Y-%m-%d"
  
  def ensure_token
    if(params[:token] == nil)
      token = Instance.generate_unique_token!
      redirect_to "/#{token}"
    end
    
    @token = params[:token]
  end
end
