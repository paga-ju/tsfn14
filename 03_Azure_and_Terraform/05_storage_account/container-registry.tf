# Creates a container registry in Azure (for Docker images).
# Note!
# - Resource "azurerm_resource_group.main" with a property "name" is defined in the file "resource-group.tf".
# - The value for "resource_group_name" below is set using property "name" in resource "azurerm_resource_group.main":
#   - resource_group_name = azurerm_resource_group.main.name
# - "name" and "location" below are set from Terraform variables defined in the file "variables.tf".


resource "azurerm_container_registry" "main" {
  name                = var.app_name
  resource_group_name = azurerm_resource_group.main.name
  location            = var.location
  admin_enabled       = true
  sku                 = "Basic"
}