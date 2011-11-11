class HomeController < ApplicationController
  def index
    @instance = Instance.where("token = ?", @token).first
    
    if(@instance != nil)
      @title = @instance.name == nil ? "Untitled" : @instance.name
    end
  end
end
