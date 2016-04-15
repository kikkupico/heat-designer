
function escapeRegExp(str) {
    return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}

function replaceAll(str, find, replace) {
  return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
}

function getNodeStart(node, source) {
	node_start = source.indexOf(node+":")-getIndentLevel(node,source);
	if (node_start == -1)
	{
		throw "ERROR:Node not Found!";
	}
	else
	{
		return node_start;
		}
}

function getIndentString(node,source) {
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
		
	i=1;
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
	pos = source.indexOf(node+":"); //not using getNodeStart because getNodeStart requires getIndentLevel
	//alert("Position in Indent Level funtion" + pos);
	
	if (pos == -1)
	{
		throw "ERROR:Node not Found!";
	}
		
	//logic for zero indent level
	if (pos ==0) {
		return 0;
		}
	if(source[pos-1] == '\n')
	{
		return 0;
		}
		
	i=1;
	indent_string = "";
	while(source[pos-i] != '\n')
	{
		//alert(source[pos-i]);
		if (source[pos-i] != ' ') {
			return -1;
		}
		i=i+1;
	}
	return i-1;
}

function getIndentLevel_UI() {
	node = document.getElementById("node").value;
	source = document.getElementById("sample-yaml").value;
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
	
	//handle last node case - this part requires better code and possibly refacting of the whole function
	if(node_end+1 == node_start)
	{
		node_end = source.length-1;
	}
	
	return node_end;
}

function getNextNode_UI() {
	node = document.getElementById("node").value;
	source = document.getElementById("sample-yaml").value;
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
	source = document.getElementById("sample-yaml").value;
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
	source = document.getElementById("sample-yaml").value;
	edited_source = removeNode(node, source);
	document.getElementById("sample-yaml").value = edited_source;
}

function copyNode_UI() {
	node = document.getElementById("node").value;
	source = document.getElementById("sample-yaml").value;
	node_content = extractNode(node, source);
	document.getElementById("new-stack").value += node_content;
}

function getChildren(node, source) {
	node_contents = extractNode(node, source);
	child_indent_level = getIndentLevel(node, source)+2;
	match_regex_pattern = "\n {"+child_indent_level+","+child_indent_level+"}(?! ).*(?=:)";
	//alert(regex_pattern);
	//alert(node_contents);
	match_regex = new RegExp(match_regex_pattern,"g");
	children = node_contents.match(match_regex);
	
	//removing preceding characters because JS doesn't support look behind
	strip_regex_pattern = "\n {"+child_indent_level+","+child_indent_level+"}(?! )";
	strip_regex = new RegExp(strip_regex_pattern,"g");
	
	var i;
	
	for(i=0;i<children.length;i++)
	{
		children[i] = children[i].replace(strip_regex,"");
	}
	return children;
}
