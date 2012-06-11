class UserController < ApplicationController
	def create
		valid = true
		resp = {}
		if (params[:username] == nil)
			valid = false
			resp[:message] = "Username is required."
		elsif (params[:email] == nil)
			valid = false
			resp[:message] = "Email is required."
		elsif (params[:password] == nil)
			valid = false
			resp[:message] = "Password is required."
		end

		if (valid)
			duplicate = User.where("username = ?", params[:username]).count > 0
			if (duplicate)
				valid = false
				resp[:message] = "That username is already taken."
			end

			duplicate = User.where("email = ?", params[:email]).count > 0
			if (duplicate)
				valid = false
				resp[:message] = "An account with that email address already exists."
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
			session[:user] = user
			cookies.delete(:username)
			render :json => user
		end
	end

	def update
	end
end
