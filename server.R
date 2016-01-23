shinyServer(function(input, output) {
  
  hls.list =  as.collapsible.tree.list(NANO,"NANO")
  output$tree = renderCollapsibleTree(
    collapsibleTree(List = hls.list)
  )
  
  output$nname = renderText ({
    cat(input$nodeName,"\n")
    return(input$nodeName)
  })
})
