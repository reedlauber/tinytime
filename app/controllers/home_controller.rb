class HomeController < TokenController
  def index
    @instance = Instance.where("token = ?", @token).first
    
    if(@instance != nil)
      @title = @instance.name == nil ? "Untitled" : @instance.name
    else
      render "notfound"
    end
  end
end
