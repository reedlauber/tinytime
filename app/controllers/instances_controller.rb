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

  def export
    user = User.where("username = ?", params[:username]).first

    if(user == nil)
      resp = { :success => false, :message => "Couldn't find user." }
    else
      instance = Instance.where("slug = ? AND token = ? AND user_id = ?", params[:slug], params[:token], user.id).first
      
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

    csv_string = CSV.generate do |csv|
      csv << ["minutes", "work_date", "description", "tags", "paid"]
      resp.each do |entry|
        csv << [entry[:minutes], entry[:work_date], entry[:description], entry[:tags], entry[:paid]]
      end
    end
    export_date = Time.now.to_formatted_s(:simple_date)
    send_data csv_string, :filename => "tinytime-#{params[:slug]}-export-#{export_date}.csv", :type => "text/csv"
  end
end
