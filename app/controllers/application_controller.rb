class ApplicationController < ActionController::Base
  protect_from_forgery
  
  ActiveRecord::Base.include_root_in_json = false
  Time::DATE_FORMATS[:simple_date] = "%Y-%m-%d"
end
