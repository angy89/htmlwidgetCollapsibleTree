library(shiny)
library(collapsibleTree)

shinyUI(fluidPage(
  titlePanel("INSIdEnano"),
  sidebarPanel("Sidebar"
    
    
  ), #end Sidebar
  mainPanel(
    wellPanel("Main Panel",
              collapsibleTreeOutput("tree")   
    )
  )
))
