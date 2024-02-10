# Create a storage container in Azure (for BLoBs, i.e. arbitrary files)

# Note!
# - Resource "azurerm_storage_account.main" with a property "name" is defined in the file "storage-account.tf".
# - The value for "storage_account_name" below is set using property "name" in resource "azurerm_storage_account.main":
#   - storage_account_name  = azurerm_storage_account.main.name

resource "azurerm_storage_container" "main" {
  name                  = "videos"
  storage_account_name  = azurerm_storage_account.main.name
  container_access_type = "private"
}