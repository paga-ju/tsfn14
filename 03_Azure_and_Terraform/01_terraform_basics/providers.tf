# Initialises Terraform providers and sets their version numbers.
# Note:
# 1) We require the provider "hashicorp/azurerm" version "3.90.0" (a specific Azure provider).
# 2) We require the version of Terrafor to be "1.7.2".
# 3) We are using the provider "azurerm" (with default features) that we required in (1).

terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "3.90.0"
    }
  }

  required_version = "= 1.7.2"
}

provider "azurerm" {
  features {}
}