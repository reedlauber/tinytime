class LogoutController < ApplicationController
	def index
		session.delete(:user)
		cookies.delete(:username)
	end
end
