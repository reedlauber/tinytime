class User < ActiveRecord::Base
  @@adjs = ["big", "brave", "bright", "busy", "careful", "clever", "cool", "daring", "fair", "fierce", 
    "free", "fun", "fuzzy", "good", "green", "grey", "happy", "light", "long", "noisy", 
    "orange", "polite", "proud", "purple", "quiet", "red", "rich", "sharp", "silent", "strong", 
    "sweet", "tidy", "useful", "violet", "warm", "yellow", "young", "teal", "plaid", "grand", 
    "super", "stable", "thoughtful", "calm", "powerful"]
  
  @@nouns = ["cat", "chihuahua", "dragon", "elk", "emu", "finch", "flower", "fountain", "hamburger", "igloo", 
    "lighthouse", "llama", "marmot", "ninja", "pants", "pillow", "pirate", "planet", "platypus", "river", 
    "rug", "sailboat", "salamander", "sloth", "spider", "star", "stone", "tree", "turtle", "waterfall"]
    
  def self.generate_random_name num
    name = ''
    rnd = Random.new
    num.times do |i|
      name += '-' if name != ''
      if (i == num - 1)
        name += @@nouns[rnd.rand(@@nouns.count)]
      else
        name += @@adjs[rnd.rand(@@adjs.count)]
      end
    end
    name
  end
  
  def self.generate_unique_username
    num_parts = 3
    username = self.generate_random_name(num_parts)
  
    existing = self.where("username ilike '#{username}%'").order("username DESC").first
  
    if(existing != nil)
      existing_highest = 0
      existing_parts = existing.username.split('-')
      if(existing_parts.count > num_parts)
        existing_highest = existing_parts[existing_parts.count-1].to_i
      end
      existing_highest += 1
      username += "-" + existing_highest.to_s
    end
  
    username
  end
end
