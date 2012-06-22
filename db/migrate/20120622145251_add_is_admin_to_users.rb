class AddIsAdminToUsers < ActiveRecord::Migration
  def up
  	add_column :users, :is_admin, :boolean, :default => false
  	User.update_all ["is_admin = ?", false]
  end

  def down
  	remove_column :users, :is_admin
  end
end
