class HomeController < TokenController
  def index
    if(@instance != nil)
      @title = @instance.name || "Untitled"
    else
      render "notfound"
    end
  end
  
  def edit
    if(@instance == nil)
      render "notfound"
    elsif (@instance.token != params[:token])
      render "index"
    else
      @title = @instance.name || "Untitled"
      
      @invoices = Invoice.where("instance_id = ?", @instance.id)
    end
  end
end
