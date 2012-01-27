class AddEmailToUser < ActiveRecord::Migration
  def self.up
  	add_column :users, :email, :string
  	add_column :users, :accessed_at, :datetime
  end

  def self.down
  	remove_column :users, :accessed_at
  	remove_column :users, :email
  end
end
