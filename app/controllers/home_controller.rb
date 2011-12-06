class HomeController < TokenController
  def index
    @instance = Instance.where("token = ?", @token).first
    
    if(@instance != nil)
      @title = @instance.name || "Untitled"
    else
      render "notfound"
    end
  end
  
  def edit
    @instance = Instance.where("token = ?", @token).first
    
    if(@instance != nil)
      @title = @instance.name || "Untitled"
      
      @invoices = Invoice.where("instance_id = ?", @instance.id)
    else
      render "notfound"
    end
  end
end
