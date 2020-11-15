application: data-portal {
  label: "Data Portal"
  file: "dist/data_portal.js"  
  entitlements: {
    allow_same_origin: yes
    allow_forms: yes
    core_api_methods: [
      "me",
      "all_user_attributes",
      "user_attribute_user_values",
      "create_user_attribute",
      "update_user_attribute",
      "user_roles",
      "all_boards", 
      "board"
    ]
  }
}
