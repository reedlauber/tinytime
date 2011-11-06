class CreateEntries < ActiveRecord::Migration
  def self.up
    create_table :entries do |t|
      t.integer :instance_id
      t.integer :group_id
      t.integer :minutes
      t.date :work_date
      t.text :description
      t.text :tags
      t.boolean :paid

      t.timestamps
    end
  end

  def self.down
    drop_table :entries
  end
end
