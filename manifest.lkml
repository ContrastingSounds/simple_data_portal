project_name: "data-portal"

application: data-portal {
  label: "Data Portal"
  file: "dist/data-portal.js"  

  entitlements: {
    use_embeds: yes
    use_form_submit: yes
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

constant: CONNECTION_NAME {
  value: "choose-connection"
  export: override_required
}