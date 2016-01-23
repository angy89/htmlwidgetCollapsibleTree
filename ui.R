library(shiny)
library(collapsibleTree)

shinyUI(fluidPage(
  titlePanel("INSIdEnano"),
  sidebarPanel("Sidebar",
        textOutput("nname")
               
    
  ), #end Sidebar
  mainPanel(
    tags$head(tags$style('.node {
  cursor: pointer;
                         }
                         
                         .node circle {
                         fill: #fff;
                         stroke: steelblue;
                         stroke-width: 1.5px;
                         }
                         
                         .node text {
                         font: 15px sans-serif;
                         }
                         
                         .link {
                         fill: none;
                         stroke: #ccc;
                         stroke-width: 0.8px;
                         stroke-length: 0.8px;
                         }')),
    wellPanel("Main Panel",
              collapsibleTreeOutput("tree")   
    )
  )
))
