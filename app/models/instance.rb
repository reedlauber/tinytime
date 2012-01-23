class Instance < ActiveRecord::Base
  def self.generate_token
    chars = 'abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789'
    token = ''
    8.times { token << chars[rand(chars.size)] }
    token
  end
  
  def self.generate_unique_token
    token = self.generate_token
    
    existing = self.where("token = '#{token}'")
    
    if(existing.count > 0)
      token = self.generate_unique_token
    end
    
    token
  end

  def generate_slug!
    slug = self.name.gsub(/[^\w\s]/, '')
    slug = slug.gsub(/[\s]/, '-')
    slug = slug[0, 255]
    slug.downcase!
    
    self.slug = slug
  end
end
