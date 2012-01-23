class InstancesController < ApplicationController
  def update
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
        if(params[:name] != nil)
          instance.name = params[:name]
          instance.generate_slug!
          instance.save
          resp = instance
        end
      end
    end
    
    render :json => resp
  end
end
