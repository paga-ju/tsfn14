# Create a storage account and storage container in Azure (for BLoBs, i.e. arbitrary files)

# Note!
# - Resource "azurerm_resource_group.main" with a property "name" is defined in the file "resource-group.tf".
# - The value for "resource_group_name" below is set using property "name" in resource "azurerm_resource_group.main":
#   - resource_group_name = azurerm_resource_group.main.name
# - "name" and "location" below are set from Terraform variables defined in the file "variables.tf".
# - The value for "storage_account_name" below is set using property "name" in resource "azurerm_storage_account.main":
#   - storage_account_name = azurerm_storage_account.main.name

resource "azurerm_storage_account" "main" {
  name                     = var.app_name
  resource_group_name      = azurerm_resource_group.main.name
  location                 = var.location
  account_kind             = "StorageV2"
  account_tier             = "Standard"
  account_replication_type = "LRS"
}

resource "azurerm_storage_container" "main" {
  name                  = "videos"
  storage_account_name  = azurerm_storage_account.main.name
  container_access_type = "private"
}