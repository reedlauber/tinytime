class Admin::InstancesController < AdminController
	def index
		@active = "projects"
		@instances = Instance.order("created_at desc").page(params[:page]).per(20)
	end

	def new
		@active = "projects"
		@user = User.where("id = ?", params[:user_id]).first
	end

	def show
		@active = "projects"
		@instance = Instance.where("id = ?", params[:id]).first
	end

	def create
		require "csv"
		instance = Instance.new
		instance.name = params[:name]
		instance.user_id = params[:user_id]
		instance.token = Instance.generate_unique_token
		instance.generate_slug!

		entries = []
		if params[:entries] != nil
			begin
				CSV.parse(params[:entries]).each do |row|
					entries << entry_from_csv_row(row)
				end
			rescue
				render :json => { :success => false, :message => "Sorry, the Entries data was not formatted correctly." }
				return false
			end
		end

		instance.save

		entries.each do |entry_info|
			entry = Entry.new
			entry.instance_id = instance.id
			entry.minutes = entry_info[:minutes]
			entry.work_date = entry_info[:work_date]
			entry.description = entry_info[:description]
			entry.tags = entry_info[:tags]
			entry.paid = entry_info[:paid]
			entry.save
		end

		render :json => { :instance => instance, :entries => entries }
	end

	def destroy
		instance = Instance.where("id = ?", params[:id]).first

		if(instance != nil)
			if(instance.num_entries > 0)
				render :json => { :success => false, :message => "Cannot delete a Project with entries." }
				return false
			end

			instance.destroy
		end

		render :json => { :success => true, :id => params[:id] }
	end

	def clean
		thirty_days_ago = Time.now - (60 * 60 * 24 * 30)
		instances = Instance.joins("LEFT OUTER JOIN users ON users.id = instances.user_id").where("name IS NULL AND users.password IS NULL AND instances.created_at < ?", thirty_days_ago)

		remove_count = 0
		instances.each do |instance|
			if(instance.num_entries == 0)
				remove_count += 1
				if(instance.user == nil)
					instance.destroy
				else
					instance.user.destroy
				end
			end
		end

		render :json => { :success => true, :count => remove_count }
	end

	private 
	def entry_from_csv_row row
		{
			:minutes => row[0].to_f,
			:work_date => Date.parse(row[1]),
			:description => row[2],
			:tags => row[3],
			:paid => row[4].to_bool
		}
	end
end
