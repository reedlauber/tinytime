Tinytime::Application.routes.draw do
  root :to => "home#index"
  
  # Content
  get "/about" => "content#about"
  
  # Invoices
  get "/:token/invoices/new" => "invoices#new"
  get "/:token/invoices(/:rank)" => "invoices#index"
  post "/:token/invoices" => "invoices#create"
  
  # Default
  get "/:token/edit" => "home#edit"
  get "/:token" => "home#index"
  
  # Instances
  post "/:token" => "instances#update"
  
  # Entries
  post "/:token/entries" => "entries#create"
  get "/:token/entries" => "entries#index"
  delete "/:token/entries/:id" => "entries#destroy"
end
