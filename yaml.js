
function escapeRegExp(str) {
    return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}

function replaceAll(str, find, replace) {
  return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
}

function helper_locateNode(node, source) {
	// if node is found at start, return start; else regex match with various possibilities
	if(source.indexOf(node+":")== 0)
		{
			return 0;
			}
	
	re = new RegExp("(\n{1,}| {1,})"+node+":");
	return source.search(re)
}


function getNodeStart(node, source) {

	// if node is found at start, return start; else regex match with various possibilities
	if(source.indexOf(node+":")== 0)
		{
			return 0;
			}
	
	re = new RegExp("(\n{1,}| {1,})"+node+":");
	
	node_loc = source.search(re);
	
	if (node_loc == -1)
	{
		throw "ERROR:Node not Found!";
	}
	
	else
	{
		//omit preceding newline characters
		while(source[node_loc] == '\n')
		{
			node_loc++;
			}
		
		//alert("node loc: "+node_loc+"--->"+source.substring(node_loc,node_loc+10));
		return node_loc;
		}
}

function getIndentString(node,source) { //DO NOT USE!! Function not updated to included fixes in getIndentLevel
	pos = getNodeStart(node, source);
	//alert("Position in Indent Level funtion" + pos);
		
	//logic for zero indent level
	if (pos ==0) {
		return '';
		}
	if(source[pos-1] == '\n')
	{
		return '';
		}
		
	var i=1;
	indent_string = "";
	while(source[pos-i] != '\n')
	{
		//alert(source[pos-i]);
		if (source[pos-i] != ' ') {
			return -1;
		}
		i=i+1;
		indent_string=indent_string+" ";
	}
	return indent_string;
}

function getIndentLevel(node,source) {

	pos = getNodeStart(node, source);
	//alert(pos);
	indent_level = 0;
	while(source[pos] == ' ')
	{
		indent_level++;
		pos++;
		}
	return indent_level;	
}

function getIndentLevel_UI() {
	node = document.getElementById("node").value;
	source = document.getElementById("stack-yaml").value;
	alert(getIndentLevel(node, source));
}

function getYAMLNodeEndRegEx(indent_level)
{
	return new RegExp('\n {0,'+indent_level+'}(?! )');
}
function getNextNode(node, source) {
	node_start = getNodeStart(node, source);
	indent_level = getIndentLevel(node, source);
	
	re = getYAMLNodeEndRegEx(indent_level);
	//alert('node start in get node function'  + node_start);
	next_node = node_start+source.substring(node_start).search(re)+indent_level+1;
	//alert(node_end);
	return next_node;
}

function getNodeEnd(node, source) {
	node_start = getNodeStart(node, source);
	indent_level = getIndentLevel(node, source);
	
	re = getYAMLNodeEndRegEx(indent_level);
	//alert('node start in get node function'  + node_start);
	
	node_end = node_start+source.substring(node_start).search(re);
	//alert(node_end);
	
	//handle last node case - this part requires better code and possibly refactoring of the whole function
	if(node_end+1 == node_start)
	{
		node_end = source.length-1;
	}
	
	return node_end;
}

function getNextNode_UI() {
	node = document.getElementById("node").value;
	source = document.getElementById("stack-yaml").value;
	node_end = getNextNode(node, source);
	//alert("Node end position" + node_end);
	alert(source.substring(node_end, node_end+source.substring(node_end).indexOf(':')));
}

function extractNode(node, source) {
	node_start = getNodeStart(node, source);
	node_end = getNodeEnd(node, source);
	return source.substring(node_start,node_end+1);
}

function extractNode_UI() {
	node = document.getElementById("node").value;
	source = document.getElementById("stack-yaml").value;
	alert(extractNode(node, source));
}

function removeNode(node, source)
{	
	node_start = getNodeStart(node, source);
	node_end = getNodeEnd(node, source);
	
	return source.substring(0,node_start)+source.substring(node_end+1);
}

function removeNode_UI() {
	node = document.getElementById("node").value;
	source = document.getElementById("stack-yaml").value;
	edited_source = removeNode(node, source);
	document.getElementById("stack-yaml").value = edited_source;
}

function copyNode_UI() {
	node = document.getElementById("node").value;
	source = document.getElementById("stack-yaml").value;
	node_content = extractNode(node, source);
	document.getElementById("new-stack").value += node_content;
}

function getChildren(node, source) {
	node_contents = extractNode(node, source);
	child_indent_level = getIndentLevel(node, source)+2;
	match_regex_pattern = "\n{1,} {"+child_indent_level+"}(?! ).*(?=:)";
	//alert(regex_pattern);
	//alert(node_contents);
	match_regex = new RegExp(match_regex_pattern,"g");
	children = node_contents.match(match_regex);
	
	//return empty array if no children found
	if (children == null)
	{
		return [];
		}

	//alert(children);
	
	//removing preceding characters because JS doesn't support look behind
	strip_regex_pattern = "\n{1,} {"+child_indent_level+"}(?! )";
	strip_regex = new RegExp(strip_regex_pattern,"g");
	
	var i;
	
	for(i=0;i<children.length;i++)
	{
		children[i] = children[i].replace(strip_regex,"");
	}
	return children;
}

function getChildren_UI()
{
	node = document.getElementById("node").value;
	source = document.getElementById("stack-yaml").value;
	children = getChildren(node,source);
	alert(children);
	//alert(children.length);
	var j;
	
	/*for(j=0;j<children.length;j++){
		alert(j+".>"+children[j]+"<");
		alert(extractNode(children[j], extractNode(node,source)));
	}*/
}

function replaceNode(node, source, new_node_content) { //note: this function will directly replace contents without checking correctness
	node_content = extractNode(node, source);
	return source.replace(node_content,new_node_content);
	}

function replaceNode_UI() {
	node = document.getElementById("node").value;
	source = document.getElementById("stack-yaml").value;
	new_node_content = document.getElementById("new-stack").value;
	
	document.getElementById("stack-yaml").value = replaceNode(node, source, new_node_content);;
}


function setChild(node, source, child, child_contents){ //NOTE:if child is not found, nothing is changed
	node_contents = extractNode(node, source);
	new_node_contents = replaceNode(child, node_contents, child_contents);
	new_source = replaceNode(node, source, new_node_contents);
	return new_source;
}

function setChild_UI() {
	node = document.getElementById("node").value;
	source = document.getElementById("stack-yaml").value;
	child = document.getElementById("child").value;
	new_child_contents = document.getElementById("new-stack").value;
	
	document.getElementById("stack-yaml").value = setChild(node, source, child, new_child_contents);
}

function renameNode(node, source, new_name) {
	node_content = extractNode(node, source);
	edited_node_content = node_content.replace(node+":", new_name+":");
	return replaceNode(node, source, edited_node_content);
}

function renameNode_UI()
{
	node = document.getElementById("node").value;
	source = document.getElementById("stack-yaml").value;
	new_name = document.getElementById("node2").value;
	
	document.getElementById("stack-yaml").value = renameNode(node, source, new_name);
}

