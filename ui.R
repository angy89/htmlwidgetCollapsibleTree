library(shiny)
library(collapsibleTree)

shinyUI(fluidPage(
  titlePanel("INSIdEnano"),
  sidebarPanel("Sidebar",
        textOutput("nname")
               
    
  ), #end Sidebar
  mainPanel(
    wellPanel("Main Panel",
              collapsibleTreeOutput("tree",width = 1500)   
    )
  )
))
