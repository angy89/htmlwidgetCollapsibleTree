setwd("~/htmlwidgetCollapsibleTree/collapsible_tree/")
devtools::install()


library(shiny)
library(collapsibleTree)
setwd("~/htmlwidgetCollapsibleTree/")
load("~/htmlwidgetCollapsibleTree/nano_chemical_disease_drugs_hierarchical_clustering.RData")

runApp("../htmlwidgetCollapsibleTree",launch.browser = TRUE)
