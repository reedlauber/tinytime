class LogInController < ApplicationController
	def index
	end

	def login
		resp = {}
		valid = true

		if(params[:username] == nil || params[:password] == nil)
			valid = false;
			resp[:message] = "Username and Password are required.";
		end

		user = User.where("username = ? OR email = ?", params[:username], params[:username]).first

		if user && user.password_digest? && user.authenticate(params[:password])
			resp = user
			session[:user] = user
		else
			valid = false
			resp[:message] = "Sorry, login was not successful.";
		end

		if(!valid)
			resp[:success] = false
		end

		render :json => resp
	end
end
