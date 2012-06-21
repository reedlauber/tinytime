# Load the rails application
require File.expand_path('../application', __FILE__)

# Initialize the rails application
Tinytime::Application.initialize!

# Mailer settings
ActionMailer::Base.delivery_method = :smtp
ActionMailer::Base.perform_deliveries = true
ActionMailer::Base.raise_delivery_errors = true

ActionMailer::Base.smtp_settings = {
  :address              => "smtp.gmail.com",
  :port                 => 587,
  :domain               => "gmail.com",
  :user_name            => "hello@cuttlefishlabs.com",
  :password             => ENV['SMTP_PASSWORD'],
  :authentication       => "plain",
  :enable_starttls_auto => true
}