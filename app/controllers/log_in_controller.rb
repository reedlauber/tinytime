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

		if(user == nil)
			valid = false
			resp[:message] = "Sorry, couldn't find your account.";
		else
			user[:password] = nil
			resp = user
			session[:user] = user
		end

		if(!valid)
			resp[:success] = false
		end

		render :json => resp
	end
end
