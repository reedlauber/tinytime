class InstancesController < ApplicationController
  def update
    instance = Instance.where("token = ?", params[:token]).first
    
    if(instance != nil)
      if(params[:name] != nil)
        instance.name = params[:name]
      end
      
      instance.save
    end
    
    render :json => instance
  end
end
