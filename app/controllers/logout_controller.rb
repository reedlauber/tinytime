class LogoutController < ApplicationController
	def index
		session[:user] = nil
		cookies[:user] = nil
	end
end
