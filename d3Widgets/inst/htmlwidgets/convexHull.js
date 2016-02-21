HTMLWidgets.widget({

  name: "convexHull",
  type: "output",


  initialize: function(el, width, height) {

    d3.select(el).append("svg")
        .attr("width", width)
        .attr("height", height);

    return d3.layout.force();
  },

  resize: function(el, width, height, force) {

    d3.select(el).select("svg")
        .attr("width", width)
        .attr("height", height);

    force.size([width, height]).resume();
  },

  renderValue: function(el, x, force) {
	  // x is a list with two elements, options and root; root must already be a
    // JSON array with the d3Tree root data
    
    var options = x.options;
    var linkColour = options.linkColour;
    var nodeColour = options.nodeColour;
    var nodeStroke = options.nodeStroke;
    var linkDistance_value = options.linkDistance;
    var charge_value = options.charge;
    
    console.log(JSON.stringify(options));

    var width = el.offsetWidth;
    var height = el.offsetHeight;
    console.log(JSON.stringify(width));
    console.log(JSON.stringify(height));


    // convert links and nodes data frames to d3 friendly format
    var imported_links = HTMLWidgets.dataframeToD3(x.links);
    var imported_nodes = HTMLWidgets.dataframeToD3(x.nodes);
    
    var groups = x.groups;
    console.log(JSON.stringify(groups));

   function pastelColors(){
    var r = (Math.round(Math.random()* 127) + 127).toString(16);
    var g = (Math.round(Math.random()* 127) + 127).toString(16);
    var b = (Math.round(Math.random()* 127) + 127).toString(16);
    return '#' + r + g + b;
  }
  
  var color_hull = [];
  for (var i = 0; i <10; i++) {
    color_hull.push( pastelColors());
 }

    var color = d3.scale.linear().domain([-2, 4]).range(["#252525", "#cccccc"]); //This is used to scale the gray color based on the propertyValue

    var force = d3.layout.force()
        .charge(charge_value)
        .linkDistance(linkDistance_value)
        .size([width, height]);
    
    console.log("Force defined");

    var svg = d3.select("body").append("svg")
        .attr("width", width)
        .attr("height", height); 
   
     console.log("svg defined");

     var groupNodes = groups.map(function(group,index){
        return group.map(function(member){return imported_nodes[member] });
  	});
    
    console.log("groupNodes defined");

    
    var minNodeSize = 2
    function radiusOf(element) {return (minNodeSize + element.nodesize) };
    
    console.log("minNodeSize defined");

    var groupPath = function(d) {
        var fakePoints = [];     
            d.forEach(function(element) { fakePoints = fakePoints.concat([   // "0.7071" is the sine and cosine of 45 degree for corner points.
                   [(element.x), (element.y + (radiusOf(element) - minNodeSize))],
                   [(element.x + (0.7071 * (radiusOf(element) - minNodeSize))), (element.y + (0.7071 * (radiusOf(element) - minNodeSize)))],
                   [(element.x + (radiusOf(element) - minNodeSize)), (element.y)],
                   [(element.x + (0.7071 * (radiusOf(element) - minNodeSize))), (element.y - (0.7071 * (radiusOf(element) - minNodeSize)))],
                   [(element.x), (element.y - (radiusOf(element) - minNodeSize))],
                   [(element.x - (0.7071 * (radiusOf(element) - minNodeSize))), (element.y - (0.7071 * (radiusOf(element) - minNodeSize)))],
                   [(element.x - (radiusOf(element) - minNodeSize)), (element.y)],
                   [(element.x - (0.7071 * (radiusOf(element) - minNodeSize))), (element.y + (0.7071 * (radiusOf(element) - minNodeSize)))]
            ]); })
            return "M" + d3.geom.hull( fakePoints ).join("L") + "Z";
    };
    
    var groupHullFill = function(d, i) { return color_hull[i % 10]; };
    //var groupHullFill = function(d, i) { return pastelColors(); };

    console.log("groupHullFill defined");

    var zoom = d3.behavior.zoom();

    force
    .nodes(imported_nodes)
    .links(imported_links)
    .linkDistance(function(thisLink) { 
        var myLength = 100, theSource = thisLink.source, theTarget = thisLink.target;
      groupNodes.forEach(function(groupList) { 
            if (groupList.indexOf(theSource) >= 0 && groupList.indexOf(theTarget) >= 0) {
            	myLength = myLength * 0.7;
        	}
        });
    	return myLength; } )
    .linkStrength(function(l, i) { return 1; } )
    .gravity(0.05) 
    .charge(-600)  
    .friction(0.5)  
    .start();
    
    console.log("force defined");
    
      // add zooming if requested
    if (options.zoom) {
      function redraw() {
        d3.select(el).select(".zoom-layer").attr("transform",
          "translate(" + d3.event.translate + ")"+
          " scale(" + d3.event.scale + ")");
      }
      
      zoom.on("zoom", redraw);
      d3.select(el).select("svg")
      .attr("pointer-events", "all")
      .call(zoom).on("dblclick.zoom", null);
    }
    else {
      zoom.on("zoom", null);
    }

    var link = svg.selectAll(".link")
    .data(imported_links)
  .enter().append("line")
    .attr("class", "link")
    .style("stroke", linkColour)
    .style("stroke-opacity",".6")
    .style("stroke-width", function(d) { return Math.sqrt(d.value); });
    
  console.log("link defined");


  var node = svg.selectAll(".node")
      .data(imported_nodes)
    .enter().append("circle")
      .attr("class", "node")
      .attr("r", function(d) { return radiusOf(d); })
      //.style("fill", function(d) { return color(d.nodesize); })
      .style("fill", nodeColour)
      .style("stroke", nodeStroke)
      .style("stroke-width", "1.5px")
      .call(force.drag);
  
      console.log("node defined");

  
  node.append("title")
      .text(function(d) { return d.name; });
  
      console.log("node title defined");

  
  force.on("tick", function() {
          console.log("in force.on tick");

    // this updates the convex hulls
    svg.selectAll("path").remove()
    
    svg.selectAll("path#group")
      .data(groupNodes)
        .attr("d", groupPath)
      .enter().insert("path", "circle")
        .style("fill", groupHullFill)
        .style("stroke", groupHullFill)
        .style("stroke-width", 35)
        .style("stroke-linejoin", "round")
        .style("opacity", .2)
    	.attr("ID","group")
        .attr("d", groupPath); 
    
    console.log("in force.on tick patch#group selected");

    
    // this redraws the links on top of the convex hulls
    svg.selectAll("line").remove()
    var link = svg.selectAll(".link")
       .data(imported_links)
       .enter().append("line")
       .attr("class", "link")
       .style("stroke-width", function(d) { return Math.sqrt(d.value); })
       .style("stroke", linkColour)
       .style("stroke-opacity",".6");

    console.log("in force.on tick line selected");
    
    // this redraws the nodes on top of the links and convex hulls
    svg.selectAll("circle").remove()
    var node = svg.selectAll(".node")
      .data(imported_nodes)
    .enter().append("circle")
      .attr("class", "node")
      .attr("r", function(d) { return radiusOf(d); })
      //.style("fill", function(d) { return color(d.nodesize); })
      .style("fill", nodeColour)
      .style("stroke", nodeStroke)
      .style("stroke-width", "1.5px")
      .call(force.drag);
    
    console.log("in force.on tick node selected");
    
    node.attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });
      
    link.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });
    
    });

  }
});
