shinyServer(function(input, output) {
  load("~/Scrivania/htmlwidget_collapsabile_tree/nano_chemical_disease_drugs_hierarchical_clustering.RData")
  hls.list =  as.collapsible.tree.list(NANO,"NANO")
 
  output$tree = renderCollapsibleTree(
    collapsibleTree(List = hls.list)
  )
})
