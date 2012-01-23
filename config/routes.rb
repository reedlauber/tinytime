Tinytime::Application.routes.draw do
  root :to => "home#index"
  
  # Content
  get "/about" => "content#about"
  
  # Invoices
  get "/:username/:slug/invoices/:rank" => "invoices#index"
  get "/:username/:slug/:token/invoices/new" => "invoices#new"
  post "/:username/:slug/invoices" => "invoices#create"
  
  # Entries
  get "/:username/:slug/entries" => "entries#index"
  post "/:username/:slug/entries" => "entries#create"
  delete "/:username/:slug/entries/:id" => "entries#destroy"
  
  # Default
  get "/:username/:slug/:token" => "home#edit"
  get "/:username(/:slug)" => "home#index"
  
  # Instances
  post "/:username/:slug" => "instances#update"
end
