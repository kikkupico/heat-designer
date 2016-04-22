var sample_yaml;

//for popover menu
var bindPopOvers = function(){
    $('[data-toggle="popover"]').popover(
	{
    html: true, 
	content: function() {
          return $('#popover-content').html();
        }
}
); 
}

$(document).ready( function(){
sample_yaml = document.getElementById("sample_yaml").value;

//create toolbox icons for each resource type
resources = getChildren("resources",sample_yaml);
resources.sort();
var i;
for(i=0;i<resources.length;i++){
	icon_html = document.getElementById("resource-icon-sample").cloneNode(true);
	icon_html.className = icon_html.className.replace("hide","");
	icon_html.id = resources[i];
	icon_html.setAttribute("resource-type",resources[i]);
	node = extractNode(resources[i],sample_yaml);
	resource_type_unformatted = extractNode("type",node);
	resource_type = resource_type_unformatted.replace("type: OS::","");
	icon_html.innerHTML = resource_type;
	//alert(resources[i]);
	document.getElementById("resource-tools").innerHTML += icon_html.outerHTML;
	}

bindPopOvers();

//delete button function
$(document).on("click", "a.delete_button" , function() {
			popOverId = $(this).parent().parent().attr("id");
			resource_id = $('[aria-describedby="'+popOverId+'"]').attr("id");
			//alert(popOverId);
			//alert(resource_id);
			doc_yaml = document.getElementById("stack_yaml").value;
			edited_yaml = removeNode(resource_id,doc_yaml);
			document.getElementById("stack_yaml").value =  edited_yaml;
			updateData();
        });

//edit properties button function
$('#edit_properties').on('show.bs.modal', function (event) {
  var button = $(event.relatedTarget) // Button that triggered the modal
  var popOverId = button.parent().parent().attr("id");
  //alert(popOverId);
  var node_label = $('[aria-describedby="'+popOverId+'"]').attr("id");
 
  //alert(node_label);
  var stack_yaml = document.getElementById("stack_yaml").value;
  var properties = extractNode("properties",extractNode(node_label, stack_yaml))
  //alert(properties);
  // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
  // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
  //var modal = document.getElementById("node_name_in_modal");
  document.getElementById("node_name_in_modal").innerHTML = node_label;
  document.getElementById("node_properties_editable").value = properties;
  
  //var modal = $(this);
  //modal.find('.modal-title').text(node_label)
  //modal.find('.modal-body textarea').text(properties)
})


updateData();

}

);


function saveProperties() {
	node_label = document.getElementById("node_name_in_modal").innerHTML;
	//alert(node_label);
	var stack_yaml = document.getElementById("stack_yaml").value;
	
	var oldProperties = extractNode("properties",extractNode(node_label, stack_yaml))
	oldSource = document.getElementById("stack_yaml").value;
	newProperties = document.getElementById("node_properties_editable").value;
	document.getElementById("stack_yaml").value = setChild(node_label, oldSource, "properties", newProperties);
	updateData();

}


function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}

function init_app(){
	
	init_hot_yaml();
	}

function init_hot_yaml(){

//add yaml init code here

document.getElementById("stack_yaml").value=extractNode("heat_template_version",sample_yaml)+"\nresources:\n";

}

function drop(ev) {
//alert('entered');
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
	//alert('entered');
    var nodeCopy = document.getElementById(data).cloneNode(true);
	var resource_type = document.getElementById(data).getAttribute("resource-type");
  nodeCopy.id = resource_type+'_'+Math.random().toString(36).substring(3,6); /* We cannot use the same ID */
  nodeCopy.draggable = false;
  nodeCopy.className += " move-cursor-style";
  nodeCopy.setAttribute("data-toggle","popover"); 
  nodeCopy.setAttribute("data-trigger","focus");
  nodeCopy.setAttribute("tabindex",0);
  nodeCopy.setAttribute("resource-type",resource_type);
  nodeCopy.setAttribute("data-container","#stack_graphical");
  nodeCopy.innerHTML += nodeCopy.id;
  ev.target.appendChild(nodeCopy);
  bindPopOvers();
//alert('entered');
	var node_sample = extractNode(resource_type,sample_yaml);
	var node_content = node_sample.replace(resource_type+":", nodeCopy.id+":");
	//alert(node_content);
	document.getElementById("stack_yaml").value+=node_content;
	updateData();
}

function drop_new(ev) {
//alert('entered');
    ev.preventDefault();
	var data = ev.dataTransfer.getData("text");
	
   	var resource_type = document.getElementById(data).getAttribute("resource-type");
  	var node_sample = extractNode(resource_type,sample_yaml);
	var id = resource_type+'_'+Math.random().toString(36).substring(3,6);
	
	var node_content = node_sample.replace(resource_type+":", id+":");
	//alert(node_content);
	document.getElementById("stack_yaml").value+=node_content;
	updateData();
}


function load_vm_with_cinder() {
	document.getElementById("stack_yaml").value = document.getElementById("vm_with_cinder").value;
	updateData();
}

function servers_in_new_neutron_net() {
	document.getElementById("stack_yaml").value = document.getElementById("servers_in_new_neutron_net").value;
	updateData();
}