class HomeController < ApplicationController
  def index
    @instance = Instance.where("token = ?", @token).first
    @notfound = false
    
    if(@instance != nil)
      @title = @instance.name == nil ? "Untitled" : @instance.name
    else
      @notfound = true
      render "notfound"
    end
  end
end
