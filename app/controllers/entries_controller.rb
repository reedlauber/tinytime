class EntriesController < ApplicationController
  def index
    instance = Instance.where("token = ?", params[:token]).first
    
    if(instance != nil)
      @entries = Entry.where("instance_id = ?", instance.id).order("work_date desc, id desc")
      
      render :json => @entries
    end
  end
  
  def create
    instance = Instance.where("token = ?", params[:token]).first
    
    resp = nil
    
    if(instance != nil)
      entry = Entry.new
      entry.instance_id = instance.id
      entry.minutes = params[:minutes]
      entry.work_date = params[:work_date]
      entry.description = params[:desc]
      entry.tags = params[:tags]
      entry.paid = false;
      entry.save
      
      resp = entry
    else
      resp = { :success => false, :message => "Couldn't find your instance." }
    end  
    
    render :json => resp
  end
  
  def destroy
    instance = Instance.where("token = ?", params[:token]).first
    
    resp = nil
    
    if(instance != nil)
      entry = Entry.find(params[:id])
      if(entry != nil)
        entry.delete
        resp = { :success => true }
      else
        resp = { :success => false, :message => "Couldn't find your entry." }
      end
    else
      resp = { :success => false, :message => "Couldn't find your instance." }
    end
    
    render :json => resp
  end
end
