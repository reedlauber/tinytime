Tinytime::Application.routes.draw do
  root :to => "home#index"
  
  get "/:token" => "home#index"
  
  # Instances
  post "/:token" => "instances#update"
  
  # Entries
  post "/:token/entries" => "entries#create"
  get "/:token/entries" => "entries#index"
  delete "/:token/entries/:id" => "entries#destroy"
end
