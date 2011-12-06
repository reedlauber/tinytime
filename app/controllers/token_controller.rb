class TokenController < ApplicationController
  before_filter :ensure_token
  
  def ensure_token
    if(params[:token] == nil)
      token = Instance.generate_unique_token!
      redirect_to "/#{token}/edit"
    end
    
    @token = params[:token]
  end
end