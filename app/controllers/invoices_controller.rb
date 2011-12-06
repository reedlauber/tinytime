class InvoicesController < TokenController
  def index
    @instance = Instance.where("token = ?", params[:token]).first
    
    if(@instance == nil)
      render "home/notfound"
    else
      @invoice = Invoice.where("instance_id = ? AND rank = ?", @instance.id, params[:rank]).first
      
      if(@invoice == nil)
        render "notfound"
      else  
        @entries = Entry.where("invoice_id = ? AND paid = true", @invoice.id).order("work_date desc")

        respond_to do |format|
          format.html  # index.html.erb
          format.json  { render :json => @entries }
        end  
      end
    end
  end
  
  def new
  end
  
  def create
    instance = Instance.where("token = ?", params[:token]).first
    
    if(instance == nil)
      render :json => { :success => false, :message => "Could not find instance." }
    else
      invoice = Invoice.new
      invoice.instance_id = instance.id
      invoice.rank = Invoice.where("instance_id = ?", instance.id).count + 1
      invoice.title = params[:title]
      invoice.rate = params[:rate].to_f
      invoice.save
      
      params[:entries].split(',').each do |entryId|
        entry = Entry.find(entryId.to_i)
        
        if(entry != nil)
          entry.paid = true
          entry.invoice_id = invoice.id
          entry.save
        end
      end
      
      render :json => invoice
    end
  end
end
