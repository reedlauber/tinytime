class Admin::UsersController < AdminController
	def index
		@active = "users"

		@count = User.count

		paging

		users = User.order("created_at DESC").offset(@offset).limit(@page_size).all

		@users = []
		users.each do |user|
			num_instances = Instance.where("user_id = ?", user.id).count
			@users << { 
				:username => user.username, 
				:created_at => user.created_at, 
				:num_instances => num_instances,
				:claimed => user.password != nil
			}
		end
	end

	def show
		@active = "users"
		
		@user = User.where("username = ?", params[:id]).first

		instances = Instance.where("user_id = ?", @user.id).order("created_at DESC")

		@instances = []
		instances.each do |instance|
			num_entries = Entry.where("instance_id = ?", instance.id).count
			@instances << { :name => instance.name, :created_at => instance.created_at, :num_entries => num_entries }
		end
	end

	def new
		@active = "users"
	end

	def create
		@user = User.create(user_params)

		if !@user.valid?
			render :json => { :success => false, :errors => @user.errors }
		else
			render :json => @user
		end
	end

	private
	def user_params
		params.permit(:username, :email, :password)
	end

	def paging
		@page_size = 10
		@offset = (params[:offset] || 0).to_i

		@prev_page = @offset - @page_size
		if(@prev_page < 0)
			@prev_page = "javascript:void(0)"
		else
			@prev_page = "?offset=#{@prev_page}"
		end
		
		@next_page = @offset + @page_size
		if(@next_page > @count - 1)
			@next_page = "javascript:void(0)"
		else
			@next_page = "?offset=#{@next_page}"
		end

		@num_pages = (@count.to_f / @page_size.to_f).floor
		@pages = (0..@num_pages).to_a
	end
end