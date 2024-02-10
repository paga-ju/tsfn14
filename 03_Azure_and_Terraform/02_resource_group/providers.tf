# Initialises Terraform providers for this Terraform project and sets their version numbers.

terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "3.90.0"
    }
  }

  required_version = "~> 1.7.0"
}

provider "azurerm" {
  features {}
}