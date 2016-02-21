library(htmlwidgets)
library(d3Widgets)
library(networkD3)

#groups =list(c(0,1,2),c(0,1,3),c(0,2,4),c(0,3,4),c(0,4,5),c(0,1,2,6),c(0,1,3,6),c(0,2,4,6),c(0,3,4,6),c(0,4,5,6),c(0,4,5,7));

groups = list()
for(i in 1:20){
  groups[[i]] = round(runif(n = 3,min = 0,max = 77),0)
}

data(MisLinks)
data(MisNodes)

Links = MisLinks
Nodes = MisNodes
Group_list = groups
NodeID="name"
Source="source"
Target = "target"
Value = "value"
Nodesize = "size"
width = 500
height=500

convexHull(Links = MisLinks,
                            Nodes = MisNodes,
                            Group_list = groups,
                            NodeID = "name",
                            Source = "source",
                            Target = "target",
                            Value = "value",
                            Nodesize = "size",
                            linkColour = "gray",
                            nodeColour = "lightgray",
                            nodeStroke = "white",
                            zoom = TRUE,
                            width = 800,
                            height=800)


