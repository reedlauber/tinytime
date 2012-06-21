class AddUserReminderFields < ActiveRecord::Migration
  def up
  	add_column :users, :reminder_token, :string
  	add_column :users, :reminded_on, :datetime
  end

  def down
  	remove_column :users, :reminded_on
  	remove_column :users, :reminder_token
  end
end
