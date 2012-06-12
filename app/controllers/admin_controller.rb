class AdminController < ActionController::Base
  protect_from_forgery
  Time::DATE_FORMATS[:simple_date] = "%Y-%m-%d"

  layout = "admin"

  def index
  	@active = "index"
  	
  	@num_accounts = User.count
  	@num_instances = Instance.count
  	@num_invoices = Invoice.count
  end
end