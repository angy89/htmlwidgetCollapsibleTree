#' @import htmlwidgets
#' @export
convexHull <- function(Links,
                            Nodes,
                            Source,
                            Target,
                            Value,
                            NodeID,
                            Nodesize,
                            Group_list,
                            linkColour = "gray",
                            nodeColour = "lightgray",
                            nodeStroke = "white",
                            height = 500,
                            width = 500,
                           # colourScale = JS("d3.scale.category20()"),
                            #fontSize = 7,
                            #fontFamily = "serif",
                            linkDistance = 50,
                            #linkWidth = JS("function(d) { return Math.sqrt(d.value); }"),
                            #radiusCalculation = JS(" Math.sqrt(d.nodesize)+6"),
                            charge = -2000,
                           # linkColour = "#666",
                            #opacity = 0.6,
                            zoom = TRUE,
                            #legend = FALSE,
                            #bounded = FALSE,
                            #opacityNoHover = 0,
                            #clickAction = NULL,
                            margin = NULL)
{
  
  if (!is.list(Group_list))
    stop("Group_list must be a list object.")
  
  # Subset data frames for network graph
  if (!is.data.frame(Links)) {
    stop("Links must be a data frame class object.")
  }
  if (!is.data.frame(Nodes)) {
    stop("Nodes must be a data frame class object.")
  }
  if (missing(Value)) {
    LinksDF <- data.frame(Links[, Source], Links[, Target])
    names(LinksDF) <- c("source", "target")
  }else{
    if (!missing(Value)) {
    LinksDF <- data.frame(Links[, Source], Links[, Target], Links[, Value])
    names(LinksDF) <- c("source", "target", "value")
    }
  }
  if (!missing(Nodesize)){
    NodesDF <- data.frame(Nodes[, NodeID], Nodes[, Nodesize])
    names(NodesDF) <- c("name", "nodesize")
    nodesize = TRUE
  }else{
#     NodesDF <- data.frame(Nodes[, NodeID], Nodes[, Group])
#     names(NodesDF) <- c("name", "group")
#     nodesize = FALSE
    stop("Specify node size")
  }
  
  
    margin <- margin_handler(margin)

  # create options
  options = list(
    NodeID = NodeID,
    linkColour = linkColour,
    nodeColour = nodeColour,
    nodeStroke = nodeStroke,
    linkDistance = linkDistance,
    charge = charge,
    zoom = zoom)
  
  #hardcoding just for tests 
  # create widget
  htmlwidgets::createWidget(
    name = "convexHull",
    x = list(links = LinksDF, nodes = NodesDF, options = options, groups = Group_list),
    width = width,
    height = height,
    htmlwidgets::sizingPolicy(padding = 10, browser.fill = TRUE),
    package = "d3Widgets"
  )
}

# Binding for shiny
#' @export
ConvexHullOutput <- function(outputId, width = "100%", height = "800px") {
    shinyWidgetOutput(outputId, "convexHull", width, height,
                        package = "d3Widgets")
					}

#' @export
renderConvexHull <- function(expr, env = parent.frame(), quoted = FALSE) {
    if (!quoted) { expr <- substitute(expr) } # force quoted
    shinyRenderWidget(expr, ConvexHullOutput, env, quoted = TRUE)
}

