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
bindPopOvers();
$(document).on("click", "a.delete_button" , function() {
			popOverId = $(this).parent().parent().attr("id");
			//alert(popOverId);
			$('[aria-describedby="'+popOverId+'"]').remove();
            $(this).parent().parent().remove();
        });
}
);

var stack_json = {
    "heat_template_version": "2015-04-30T00:00:00.000Z",
    "description": "Simple template to deploy a single compute instance",
	"resources":[]
};

var stack_yaml;

var resource_templates_json = {
	"server": {
		"type": "OS::Nova::Server",
		"properties": [{
			"key_name": {
				"get_param": "key_name"
			}
		}, {
			"image": {
				"get_param": "image"
			}
		}, {
			"flavor": {
				"get_param": "flavor"
			}
		}, {
			"admin_pass": {
				"get_param": "admin_pass"
			}
		}, {
			"user_data": {
				"str_replace": {
					"template": "echo db_port\n",
					"params": {
						"db_port": {
							"get_param": "db_port"
						}
					}
				}
			}
		}]
	}
};

var sample_templates_json = {
     "parameters": {
        "key_name": {
            "type": "string",
            "description": "Name of an existing key pair to use for the server",
            "constraints": [
                {
                    "custom_constraint": "nova.keypair"
                }
            ]
        },
        "flavor": {
            "type": "string",
            "description": "Flavor for the server to be created",
            "default": "m1.small",
            "constraints": [
                {
                    "custom_constraint": "nova.flavor"
                }
            ]
        },
        "image": {
            "type": "string",
            "description": "Image ID or image name to use for the server",
            "constraints": [
                {
                    "custom_constraint": "glance.image"
                }
            ]
        },
        "admin_pass": {
            "type": "string",
            "description": "Admin password",
            "hidden": true,
            "constraints": [
                {
                    "length": {
                        "min": 6,
                        "max": 8
                    },
                    "description": "Password length must be between 6 and 8 characters"
                },
                {
                    "allowed_pattern": "[a-zA-Z0-9]+",
                    "description": "Password must consist of characters and numbers only"
                },
                {
                    "allowed_pattern": "[A-Z]+[a-zA-Z0-9]*",
                    "description": "Password must start with an uppercase character"
                }
            ]
        },
        "db_port": {
            "type": "number",
            "description": "Database port number",
            "default": 50000,
            "constraints": [
                {
                    "range": {
                        "min": 40000,
                        "max": 60000
                    },
                    "description": "Port number must be between 40000 and 60000"
                }
            ]
        }
    },
    "resources": {
        "server": {
            "type": "OS::Nova::Server",
            "properties": {
                "key_name": {
                    "get_param": "key_name"
                },
                "image": {
                    "get_param": "image"
                },
                "flavor": {
                    "get_param": "flavor"
                },
                "admin_pass": {
                    "get_param": "admin_pass"
                },
                "user_data": {
                    "str_replace": {
                        "template": "echo db_port\n",
                        "params": {
                            "db_port": {
                                "get_param": "db_port"
                            }
                        }
                    }
                }
            }
        }
    },
    "outputs": {
        "server_networks": {
            "description": "The networks of the deployed server",
            "value": {
                "get_attr": [
                    "server",
                    "networks"
                ]
            }
        }
    }
};

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

//Array.prototype.push.apply(stack_yaml_json,version_template_json);
//Array.prototype.push.apply(stack_yaml_json,parameters_template_json);

//stack_json.push(version_template_json);
//stack_json.push(parameters_template_json);

stack_json['resources'] = resource_templates_json['server'];

stack_yaml = YAML.stringify(stack_json);

document.getElementById("stack_yaml").value=stack_yaml;

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
document.getElementById("stack_yaml").innerHTML+="resources\:\n  my_instance\:\n    type: OS\:\:Nova\:\:Server\n    properties\:\n      key_name\: my_key\n      image\: F18-x86_64-cfntools\n      flavor\: m1.small".replace(/(\n)+/g, '<br />');
}
