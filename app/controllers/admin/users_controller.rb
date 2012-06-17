class Admin::UsersController < AdminController
	def index
		@active = "users"

		@count = User.count

		per = 10

		@offset = ((params[:page] || 1).to_i - 1) * per
		@users = User.order("created_at DESC").page(params[:page]).per per
	end

	def show
		@active = "users"
		
		@user = User.where("id = ?", params[:id]).first

		@instances = Instance.where("user_id = ?", @user.id).order("created_at DESC")
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
end