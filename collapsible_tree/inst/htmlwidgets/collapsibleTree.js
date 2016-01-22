HTMLWidgets.widget({

  name: "collapsibleTree",
  type: "output",

  initialize: function(el, width, height) {

    d3.select(el).append("svg")
      .style("width", "100%")
      .style("height", "100%")
      
    return d3.layout.tree();

  },

  resize: function(el, width, height, tree) {
    // resize now handled by svg viewBox attribute
    /*
    var diameter = Math.min(parseInt(width),parseInt(height));
    var s = d3.select(el).selectAll("svg");
    s.attr("width", width).attr("height", height);
    tree.size([360, diameter/2 - parseInt(s.attr("margin"))]);
    var svg = d3.select(el).selectAll("svg").select("g");
    svg.attr("transform", "translate(" + diameter / 2 + "," + diameter / 2 + ")"
                         + " scale("+diameter/800+","+diameter/800+")");
    */

  },

  renderValue: function(el, x, tree) {
	// x is a list with two elements, options and root; root must already be a
    // JSON array with the d3Tree root data
    var i = 0;
    var duration = 750;
   
   var s = d3.select(el).selectAll("svg");

    // margin handling
    //   set our default margin to be 20
    //   will override with x.options.margin if provided
    var margin = {top: 20, right: 20, bottom: 20, left: 20};
    //   go through each key of x.options.margin
    //   use this value if provided from the R side
    Object.keys(x.options.margin).map(function(ky){
      if(x.options.margin[ky] !== null) {
        margin[ky] = x.options.margin[ky];
      }
      // set the margin on the svg with css style
      // commenting this out since not correct
      //s.style(["margin",ky].join("-"), margin[ky]);
    });

   // tree.size([360, diameter/2])
   //     .separation(function(a, b) { return (a.parent == b.parent ? 1 : 2) / a.depth; });

    // select the svg group element and remove existing children
   // s.attr("pointer-events", "all").selectAll("*").remove();
   // s.append("g")
   //  .attr("transform", "translate(" + diameter / 2 + "," + diameter / 2 + ")"
    //                     + " scale("+1+","+1+")");

    var svg = d3.select(el).selectAll("g");

    var root = x.root;
    var nodes = tree.nodes(root),
        links = tree.links(nodes);
	
	console.log(x.root);
    var diagonal = d3.svg.diagonal()
                          .projection(function(d) { return [d.y, d.x]; });
    
    
    console.log(diagonal);

    function collapse(d) {
		if (d.children) {
			d._children = d.children;
            d._children.forEach(collapse);
            d.children = null;
        }
    }                          
    
    //root.children.forEach(collapse);
     update(root); 
                          
    
                          
    d3.select(self.frameElement).style("height", "800px");
	
	function update(source){
  
		  // Compute the new tree layout.
		  var nodes = tree.nodes(root).reverse(),
		  links = tree.links(nodes);
		  
		  // Normalize for fixed-depth.
		  nodes.forEach(function(d) { d.y = d.depth * 180; });
		  
		  // Update the nodes…
		  var node = svg.selectAll("g.node")
		  .data(nodes, function(d) { return d.id || (d.id = ++i); });
		  
		  // Enter any new nodes at the parent's previous position.
		  var nodeEnter = node.enter().append("g")
		  .attr("class", "node")
		  .attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
		  .on("click", click);
		  
		  nodeEnter.append("circle")
		  .attr("r", 1e-6)
		  .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });
		  
		  nodeEnter.append("text")
		  .attr("x", function(d) { return d.children || d._children ? -10 : 10; })
		  .attr("dy", ".35em")
		  .attr("text-anchor", function(d) { return d.children || d._children ? "end" : "start"; })
		  .text(function(d) { return d.name; })
		  .style("fill-opacity", 1e-6);
		  
		  // Transition nodes to their new position.
		  var nodeUpdate = node.transition()
		  .duration(duration)
		  .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });
		  
		  nodeUpdate.select("circle")
		  .attr("r", 4.5)
		  .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });
		  
		  nodeUpdate.select("text")
		  .style("fill-opacity", 1);
		  
		  // Transition exiting nodes to the parent's new position.
		  var nodeExit = node.exit().transition()
		  .duration(duration)
		  .attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
		  .remove();
		  
		  nodeExit.select("circle")
		  .attr("r", 1e-6);
		  
		  nodeExit.select("text")
		  .style("fill-opacity", 1e-6);
		  
		  // Update the links…
		  var link = svg.selectAll("path.link")
		  .data(links, function(d) { return d.target.id; });
		  
		  // Enter any new links at the parent's previous position.
		  link.enter().insert("path", "g")
		  .attr("class", "link")
		  .attr("d", function(d) {
		  var o = {x: source.x0, y: source.y0};
		  return diagonal({source: o, target: o});
		  });
		  
		  // Transition links to their new position.
		  link.transition()
		  .duration(duration)
		  .attr("d", diagonal);
		  
		  // Transition exiting nodes to the parent's new position.
		  link.exit().transition()
		  .duration(duration)
		  .attr("d", function(d) {
			var o = {x: source.x, y: source.y};
			return diagonal({source: o, target: o});
		  })
		  .remove();
		  
		  // Stash the old positions for transition.
		  nodes.forEach(function(d) {
			d.x0 = d.x;
			d.y0 = d.y;
		  });
	}

	// Toggle children on click.
	function click(d) {
	  Shiny.onInputChange("mydata", d.name);
	  if (d.children) {
		d._children = d.children;
		d.children = null;
	  } else {
		d.children = d._children;
		d._children = null;
	  }
	  update(d);
	  
	}
  }
});
