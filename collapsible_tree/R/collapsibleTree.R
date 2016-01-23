#' @import htmlwidgets
#' @export
collapsibleTree <- function(
                          List,
                          height = NULL,
                          width = NULL,
                          fontSize = 10,
                          fontFamily = "serif",
                          linkColour = "#ccc",
                          nodeColour = "#fff",
                          nodeStroke = "steelblue",
                          textColour = "#111",
                          opacity = 0.9,
                          margin = NULL)
{
    # validate input
    if (!is.list(List))
      stop("List must be a list object.")
    root <- List
    
    margin <- margin_handler(margin)

    # create options
    options = list(
        height = height,
        width = width,
        fontSize = fontSize,
        fontFamily = fontFamily,
        linkColour = linkColour,
        nodeColour = nodeColour,
        nodeStroke = nodeStroke,
        textColour = textColour,
        margin = margin,
        opacity = opacity
    )

    # create widget
    htmlwidgets::createWidget(
      name = "collapsibleTree",
      x = list(root = root, options = options),
      width = width,
      height = height,
      htmlwidgets::sizingPolicy(padding = 10, browser.fill = TRUE),
      package = "collapsibleTree")
}

# Binding for shiny
#' @export
collapsibleTreeOutput <- function(outputId, width = "100%", height = "800px") {
    shinyWidgetOutput(outputId, "collapsibleTree", width, height,
                        package = "collapsibleTree")
					}

#' @export
renderCollapsibleTree <- function(expr, env = parent.frame(), quoted = FALSE) {
    if (!quoted) { expr <- substitute(expr) } # force quoted
    shinyRenderWidget(expr, collapsibleTreeOutput, env, quoted = TRUE)
}

#' Convert an R hclust or dendrogram object into a collapsibleTree list.
as.collapsible.tree.list = function(hls,rootName){
  merge = hls$merge  
  labels = hls$labels
  
  nodes = list()
  left = 1
  rigth = 2
  
  for(i in 1:nrow(merge)){
    if(merge[i,left]<0){
      left_child = list(name = labels[abs(merge[i,left])])
    }else{
      left_child =  nodes[[merge[i,left]]]
    }
    if(merge[i,rigth]<0){
      rigth_child = list(name = labels[abs(merge[i,rigth])])
    }else{
      rigth_child =  nodes[[merge[i,rigth]]]
    }
    
    nodes[[i]]=list(name = "",children = list(left_child,rigth_child))
  }
  
  n = length(nodes)
  hls$name = rootName
  return(nodes[[n]])
}
