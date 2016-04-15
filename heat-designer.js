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
var i;
for(i=0;i<resources.length;i++){
	icon_html = document.getElementById("resource-icon-sample").cloneNode(true);
	icon_html.className = icon_html.className.replace("hide","");
	icon_html.id = resources[i];
	icon_html.setAttribute("resource-type",resources[i]);
	icon_html.getElementsByTagName("header")[0].innerHTML = resources[i];
	//alert(resources[i]);
	document.getElementById("resource-tools").innerHTML += icon_html.outerHTML;
	}

bindPopOvers();

//delete button function
$(document).on("click", "a.delete_button" , function() {
			popOverId = $(this).parent().parent().attr("id");
			resource_type = $('[aria-describedby="'+popOverId+'"]').attr("resource-type");
			//alert(popOverId);
			//alert(resource_type);
			$('[aria-describedby="'+popOverId+'"]').remove();
            $(this).parent().parent().remove();
			doc_yaml = document.getElementById("stack_yaml").value;
			edited_yaml = removeNode(resource_type,doc_yaml);
			document.getElementById("stack_yaml").value =  edited_yaml;
        });
}
);

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

	Sortable.create(stack_graphical, { /* options */ });
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
document.getElementById("stack_yaml").value+=extractNode(resource_type,sample_yaml);
}
