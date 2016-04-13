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
bindPopOvers();

//delete button function
$(document).on("click", "a.delete_button" , function() {
			popOverId = $(this).parent().parent().attr("id");
			//alert(popOverId);
			$('[aria-describedby="'+popOverId+'"]').remove();
            $(this).parent().parent().remove();
			doc_yaml = document.getElementById("stack_yaml").value;
			edited_yaml = removeNode("server",doc_yaml);
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
  nodeCopy.id = Math.random().toString(36).substring(7); /* We cannot use the same ID */
  nodeCopy.draggable = false;
  nodeCopy.className += " move-cursor-style";
  nodeCopy.setAttribute("data-toggle","popover"); 
  nodeCopy.setAttribute("data-trigger","focus");
  nodeCopy.setAttribute("tabindex",0);  
  nodeCopy.setAttribute("data-container","#stack_graphical");
  ev.target.appendChild(nodeCopy);
  bindPopOvers();
//alert('entered');
document.getElementById("stack_yaml").value+=extractNode("server",sample_yaml);
}
