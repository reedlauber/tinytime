class HomeController < ApplicationController
  def index
    @instance = Instance.where("token = ?", @token).first
    
    @title = @instance.name == nil ? "Untitled" : @instance.name
  end
end
