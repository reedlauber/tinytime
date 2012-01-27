class UserController < ApplicationController
	def create
		valid = true
		resp = {}
		if (params[:username] == nil)
			valid = false
			resp[:message] = "Username is required."
		elsif (params[:email] == nil)
			valid = false
			resp[:message] = "email is required."
		elsif (params[:password] == nil)
			valid = false
			resp[:message] = "Password is required."
		end

		if (valid)
			duplicate = User.where("username = ? OR email = ?", params[:username], params[:email]).count > 0
			if (duplicate)
				valid = false
				resp[:message] = "That username or email is already taken."
			end
		end

		if (!valid)
			resp[:success] = false
			render :json => resp
		else
			user = nil
			if(cookies[:username] != nil)
				user = User.where("username = ?", cookies[:username]).first
			end

			if(user == nil)
				user = User.new
			end
			user.username = params[:username]
			user.email = params[:email]
			user.password = params[:password]
			user.save
			user.password = nil
			session[:user] = user;
			render :json => user
		end
	end

	def update
	end
end
