# Sets global variables for this Terraform project.
# Note:
# - The block type is "variable" since we are defining a Terraform variable.
# - "app_name" and "location" is the names of the Terraform variables.
# - "default" is used to set the value for a Terraform variable.
# - if "default" is omitted, Terraform will ask the user to input the value for the variable during "terraform apply".

variable "app_name" {
  default = "tsfn14g00"
}

variable "location" {
  default = "westeurope"
}