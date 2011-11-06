Tinytime::Application.routes.draw do
  root :to => "home#index"
  
  get "(/:token)" => "home#index"
  
  get "/:token/entries" => "entries#index"
  delete "/:token/entries/:id" => "entries#destroy"
  
  resources :entries
  
  # This is a legacy wild controller route that's not recommended for RESTful applications.
  # Note: This route will make all actions in every controller accessible via GET requests.
  # match ':controller(/:action(/:id(.:format)))'
end
