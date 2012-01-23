class EntriesController < ApplicationController
  def index
    user = User.where("username = ?", params[:username]).first

    if(user == nil)
      resp = { :success => false, :message => "Couldn't find user." }
    else
      instance = Instance.where("slug = ? AND user_id = ?", params[:slug], user.id).first
      
      if(instance == nil)
        resp = { :success => false, :message => "Couldn't find your instance." }
      else
        where = "instance_id = ?"
        if(params[:paid] != "true")
          where += " AND paid = false"
        end
        resp = Entry.where(where, instance.id).order("work_date desc, id desc")
      end
    end
    
    render :json => resp
  end
  
  def create
    user = User.where("username = ?", params[:username]).first

    if(user == nil)
      resp = { :success => false, :message => "Couldn't find user." }
    else
      instance = Instance.where("slug = ? AND user_id = ?", params[:slug], user.id).first

      if(instance == nil)
        resp = { :success => false, :message => "Couldn't find your instance." }
      elsif(instance.token != params[:token])
        resp = { :success => false, :message => "Not authorized to edit this instance." }
      else
        entry = Entry.new
        entry.instance_id = instance.id
        entry.minutes = params[:minutes]
        entry.work_date = params[:work_date]
        entry.description = params[:desc]
        entry.tags = params[:tags]
        entry.paid = false;
        entry.save
        
        resp = entry
      end
    end
    
    render :json => resp
  end
  
  def destroy
    user = User.where("username = ?", params[:username]).first

    if(user == nil)
      resp = { :success => false, :message => "Couldn't find user." }
    else
      instance = Instance.where("slug = ? AND user_id = ?", params[:slug], user.id).first
      
      if(instance == nil)
        resp = { :success => false, :message => "Couldn't find your instance." }
      elsif(instance.token != params[:token])
        resp = { :success => false, :message => "Not authorized to edit this instance." }
      else
        entry = Entry.find(params[:id])
        if(entry != nil)
          entry.delete
          resp = { :success => true }
        else
          resp = { :success => false, :message => "Couldn't find your entry." }
        end
      end
    end
    
    render :json => resp
  end
end
