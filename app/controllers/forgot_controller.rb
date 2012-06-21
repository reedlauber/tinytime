class ForgotController < ApplicationController
	def send_reminder
		user = User.where("email = ?", params[:email]).first

		if(user != nil)
			user.reminder_token = Instance.generate_token
			user.reminded_on = Time.now
			user.save(:validate => false)
			PasswordReset.password_reset(user).deliver
			render :json => { :success => true }
		else
			render :json => { :success => false, :message => "Could not find account." }
		end
	end

	def reset
		validate_reset
	end

	def reset_update
		validate_reset

		if @error == nil
			if params[:password] == nil
				@error = "Password is required."
			elsif params[:password] != params["password2"]
				@error = "Passwords do not match."
			else
				@user.password = params[:password]
				@user.save
				if @user.invalid?
					@error = @user.errors
				end
			end
		end

		render :json => { :success => @error == nil, :message => @error }
	end

	private 
	def validate_reset
		if params[:email] == nil
			@error = "Sorry, this request is not valid."
		else
			@user = User.where("email = ?", params[:email]).first

			if @user == nil
				@error = "Couldn't find an account."
			else
				if params[:token] == nil || params[:token] != @user.reminder_token
					@error = "Sorry, this request is not valid. (#{params[:token]} != #{user.reminder_token})"
				else
					if @user.reminded_on < Time.now - (60 * 60 * 24)
						@error = "Sorry, your password reset link has expired."
					end
				end
			end
		end
	end
end
