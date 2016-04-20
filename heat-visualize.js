
var json = {
  nodes:[],
  links:[]
};

//var resources = getChildren("resources",document.getElementById("stack_yaml").value);

function getNodes() {
	
	var yaml = document.getElementById("stack_yaml").value;
	
	for(var i=0;i<resources.length;i++) {
		var node_content = extractNode(resources[i], yaml);
		var resource_type_unformatted = extractNode("type",node_content);
		var resource_type = resource_type_unformatted.replace("type: OS::","").trim();
		
		var node = {name:resources[i],type:resource_type, "data-toggle":"popover"};
		
		json["nodes"].push(node);
		}
}

function getLinks() {

	//a really dumb algorithm to find links
	
	var yaml = document.getElementById("stack_yaml").value;
	
	for(var i=0;i<resources.length;i++) {
		linked_resources = find_linked_resources(extractNode(resources[i],yaml));
		
		for(var j=0;j<linked_resources.length;j++){
			var link = {source:i,target:resources.indexOf(linked_resources[j][1]),name:linked_resources[j][0]}
			//alert("source: " + resources[i] + " target:"+linked_resources[j]);
			json["links"].push(link);
			}
		}
}

function find_linked_resources(source) {
	var cursor = 0;
	var foundpos = source.indexOf("get_resource", cursor);
	var linked_resource;
	var linked_resources = [];
	var node_label = "";
	
	while(foundpos > -1)
		{
			linked_resource = source.substring(foundpos+"get_resource:".length, source.indexOf("}", foundpos)).trim();
			
			//find node containing linked value (using a very dumb algorithm)
			var i=foundpos-1;
			
			while(i>=0) {
				if (source[i] == '\n') {
					node_label = source.substring(i+1,source.indexOf(":",i)).trim();
					break;
					}
				else {
					i--;
					}
				}
				//alert(node_label);
				linked_resources.push([node_label,linked_resource]);
				cursor = source.indexOf("get_resource", cursor)+"get_resource".length;
				foundpos = source.indexOf("get_resource", cursor);
		}
	return linked_resources;
}

function getHorizonIcon(resource_type) {

	switch(resource_type) {
		case "Nova::Server":
			return "images/horizon-icons/server-green.svg";
		case "Neutron::Net":
			return "images/horizon-icons/network-green.svg";
		case "Cinder::Volume":
			return "images/horizon-icons/volume-green.svg";
		case "Neutron::Port":
			return "images/horizon-icons/port-green.svg";
		case "Neutron::SecurityGroup":
			return "images/horizon-icons/securitygroup-green.svg";
		case "Neutron::FloatingIP":
			return "images/horizon-icons/floatingip-green.svg";
		case "Neutron::Router":
			return "images/horizon-icons/router-green.svg";
		default:
			return "images/horizon-icons/unknown-green.svg";
	}
}

function updateData() {
	
	//empty json data and html views
	document.getElementById("stack-d3vis").innerHTML ="";
	document.getElementById("stack-d3vis").value = "";
	
	json = {
			nodes:[],
			links:[]
			};
	
	resources = getChildren("resources",document.getElementById("stack_yaml").value);
	
	//if no resources are found, exit function
	if (resources.length == 0)
	{
		return;
		}
			
	getNodes();
	getLinks();
	
	var width = 600,
    height = 600

	var svg = d3.select("#stack-d3vis").append("svg")
    .attr("width", width)
    .attr("height", height);
	
	var force;
	
	force = d3.layout.force()
      .gravity(0.1)
      .charge(-2000)
    .size([width, height]);

	force.linkDistance(100);
	//force.gravity(0);

	/*d3.layout.force() 
      .nodes(graph.nodes)
      .links([])
      .gravity(0.1)
      .charge(-2000)
      .linkDistance(100)
      .size([width, height])
      .on("tick", tick)*/
	
	
  force
      .nodes(json.nodes)
      .links(json.links)
      .start();

   var link = svg.selectAll(".link")
    .data(json.links)
   .enter()
    .append("g")
    .attr("class", "link")
    .append("line")
    .attr("class", "link-line")
    .style("stroke-width", function (d) {
        return Math.sqrt(d.value);
    });
	  
	var linkText = svg.selectAll(".link")
    .append("text")
    .attr("class", "link-label")
   .attr("font-family", "Arial, Helvetica, sans-serif")
    .attr("fill", "Black")
    .style("font", "normal 10px Arial")
    .attr("dy", ".35em")
    .attr("text-anchor", "middle")
    .text(function(d) {
        return d.name;
    });

  var node = svg.selectAll(".node")
      .data(json.nodes)
    .enter().append("g")
      .attr("class", "node")
      .call(force.drag);

	  
  node.append("image")
      .attr("xlink:href", function(d) { return getHorizonIcon(d.type) })
      .attr("x", -8)
      .attr("y", -8)
      .attr("width", 48)
      .attr("height", 48);

  /*node.append("text")
	  .attr("data-toggle","popover")
	  .attr("data-trigger","focus")
	  .attr("tabindex",0)
	  .attr("data-container","#stack_graphical")
      .attr("dx", 36)
      .attr("dy", ".35em")
      .text(function(d) { return d.name });*/

	  node.append('svg:foreignObject')
	  .attr("dx", 36)
      .attr("dy", ".35em")
    .attr('width', "100%")
    .attr('height', "100%")
    .append('xhtml:span')
    .attr("class","resource-id")
	.attr("id",function(d) { return d.name })
    .attr("data-toggle","popover")
	.attr("data-trigger","focus")
	.attr("tabindex",0)
	.attr("data-container","#stack-d3vis")
    .html(function(d) { return d.name })
    .each(function(){
        $(this).popover({
            html: true, 
			content: function() {
					return $('#popover-content').html();
				}
			})
		});

	/*node.append("foreignObject")
    .append("xhtml:body")
	.attr("dx", function(d){return -40})
	.style("font", "8px 'Helvetica Neue'")
    .html(function(d){return d.type });*/
  
	
	/*node.append("text")
	    .attr("dx", function(d){return -20})
	    .text(function(d){return d.type0 })
	
	node.append("text")
	    .attr("dx", function(d){return -20})
		.attr("dy", function(d){return 10})
	    .text(function(d){return d.type1 })*/

  force.on("tick", function() {
    link.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
	
	linkText
        .attr("x", function(d) {
            return ((d.source.x + d.target.x)/2);
        })
        .attr("y", function(d) {
            return ((d.source.y + d.target.y)/2);
        });
  });

 }