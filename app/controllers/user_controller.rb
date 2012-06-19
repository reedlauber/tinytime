class UserController < ApplicationController
	def create
		user = nil
		if(cookies[:username] != nil)
			user = User.where("username = ?", cookies[:username]).first
		end

		if(user == nil)
			user = User.create(user_params)
		else
			user.username = params[:username]
			user.email = params[:email]
			user.password = params[:password]
			user.save
		end

		if !user.valid?
			render :json => { :success => false, :errors => user.errors }
		else
			session[:user] = user
			cookies.delete(:username)
			render :json => user
		end
	end

	def update
	end

	private
	def user_params
		params.permit(:username, :email, :password)
	end
end
