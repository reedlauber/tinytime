Tinytime::Application.routes.draw do
  root :to => "home#index"
  
  # Content
  get "/about" => "content#about"

  # Sign Up
  get "/signup" => "sign_up#index"

  # Log In
  get "/login" => "log_in#index"
  post "/login" => "log_in#login"

  # Forgot
  get "/forgot/reset" => "forgot#reset"
  post "/forgot/reset" => "forgot#reset_update"
  get "/forgot" => "forgot#index"
  post "/forgot" => "forgot#send_reminder"

  # Log Out
  get "/logout" => "logout#index"

  # User Resource
  put "/account" => "user#create"
  post "/account/:username" => "user#update"

  get "/admin" => "admin#index", as: :admin
  namespace :admin do
    resources :users do
      resources :instances
    end
    resources :instances
    post "/instances/clean" => "instances#clean"
  end

  # Export
  get "/:username/:slug/:token/export" => "instances#export"
  
  # Invoices
  get "/:username/:slug/invoices/:rank" => "invoices#index"
  get "/:username/:slug/:token/invoices/new" => "invoices#new"
  post "/:username/:slug/invoices" => "invoices#create"
  
  # Entries
  get "/:username/:slug/entries" => "entries#index"
  put "/:username/:slug/entries" => "entries#create"
  delete "/:username/:slug/entries/:id" => "entries#destroy"
  
  # Default
  get "/:username/:slug/:token" => "home#edit"
  get "/:username/:slug" => "home#timesheet"
  get "/:username" => "home#index"
  
  # Instances
  post "/:username/:slug" => "instances#update"
end