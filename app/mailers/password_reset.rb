class PasswordReset < ActionMailer::Base
  default from: "hello@tinyti.me", :subject => "[TinyTime] Password Reset"

  def password_reset(user)
  	@user = user
  	mail(:to => user.email)
  end
end
