class Instance < ActiveRecord::Base
  def self.generate_token
    chars = 'abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789'
    token = ''
    8.times { token << chars[rand(chars.size)] }
    token
  end
  
  def self.generate_unique_token!
    token = self.generate_token
    
    existing = self.where("token = '#{token}'")
    
    if(existing.count > 0)
      token = self.generate_unique_token!
    end
    
    instance = Instance.new
    instance.token = token
    instance.save
    
    token
  end
end
