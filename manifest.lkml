application: data-portal {
  label: "Data Portal"
  file: "dist/data_portal.js"  
  entitlements: {
    allow_same_origin: yes
    core_api_methods: ["me","all_user_attributes","user_attribute_user_values", "board"]
  }
}

constant: CONNECTION_NAME {
  value: "choose-connection"
  export: override_required
}
