class AddSlugToInstances < ActiveRecord::Migration
  def self.up
  	add_column :instances, :slug, :string
  	add_index :instances, :slug
  end

  def self.down
  	remove_index :instances, :slug
  	remove_column :instances, :slug
  end
end
