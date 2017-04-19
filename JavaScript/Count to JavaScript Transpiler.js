function Init() {
	
	/*Count_Code_Box = document.createElement("div");
	Count_Code_Box.setAttribute("contenteditable", "true");
	Count_Code_Box.innerHTML = "";
	document.body.appendChild(Count_Code_Box);*/
	
	Count_Code_Box = document.createElement("textarea");
	Count_Code_Box.setAttribute("cols", "96");
	Count_Code_Box.setAttribute("rows", "32");
	Count_Code_Box.setAttribute("placeholder", "Count code goes here:");
	Count_Code_Box.style.resize = "none";
	Count_Code_Box.style.display = "block";
	Count_Code_Box.style.margin = "0 auto";
	document.body.appendChild(Count_Code_Box);
	
	compile = document.createElement("button");
	compile.style.resize = "none";
	compile.style.display = "block";
	compile.style.margin = "0 auto";
	compile.innerHTML = "Compile!";
	document.body.appendChild(compile);
	
	compile.addEventListener("click", Compile);
	
}

function Compile() {
	
	var Count_Code = new Count(Count_Code_Box.value + " ");
	
	// confirm(JSON.stringify(Count_Code.compile(), null, 4)); // Now I need to compile, not show the JSON!
	
	var compiled = Count_Code.compile();
	
	eval(JS_Compile(compiled));
	
}

function JS_Compile(code) {
	
	var Commands_Transpiled = "";
	
	for(var count = 0; count < code.length; count++) {
		
		Commands_Transpiled += Transpile("command", code[count]);
		
		Commands_Transpiled += ";\n";
		
	}
	
	return Commands_Transpiled;
	
}

function Transpile(type, code) {
	
	switch(type) {
		
		case "command":
			
			var command = Transpile(code[0][0], code[0][1]);
			
			switch(command) {
				
				case "declare":
					
					return "var " + code[1][1];
				
				case "set":
					
					return code[1][1][0][1] + " = " + Transpile(code[1][1][1][0], code[1][1][1][1]);
				
				case "if":
					
					return "if(" + Transpile(code[1][1][0][0], code[1][1][0][1]) + ") {" + Transpile(code[1][1][1][0], code[1][1][1][1]) + "()}";
				
				case "loop":
					
					return "while(" + Transpile(code[1][1][0][0], code[1][1][0][1]) + ") {" + Transpile(code[1][1][1][0], code[1][1][1][1]) + "()}";
				
				case "give":
					
					return "return " + Transpile(code[1][0], code[1][1]);
				
				case "item":
					
					return Transpile(code[1][1][0][0], code[1][1][0][1]) + "[" + (Transpile(code[1][1][1][0], code[1][1][1][1]) - 1) + "]";
				
				case "length":
					
					return Transpile(code[1][0], code[1][1]) + ".length";
				
				case "say":
					
					return "confirm(" + Transpile(code[1][0], code[1][1]) + ")";
				
				case "debug":
					
					return "console.log(" + Transpile(code[1][0], code[1][1]) + ")";
				
				case "af":
					
					return Transpile(code[1][1][0][0], code[1][1][0][1]) + ".push(" + Transpile(code[1][1][1][0], code[1][1][1][1]) + ")";
				
				case "ab":
					
					return Transpile(code[1][1][0][0], code[1][1][0][1]) + ".unshift(" + Transpile(code[1][1][1][0], code[1][1][1][1]) + ")";
				
				case "rf":
					
					return Transpile(code[1][0], code[1][1]) + ".pop()";
				
				case "rb":
					
					return Transpile(code[1][0], code[1][1]) + ".shift()";
				
				default:
					
					return command + "(" + Transpile(code[1][0], code[1][1]) + ")";
				
			}
		
		case "boolean":
		case "name":
		case "number":
			
			return code;
		
		case "string":
			
			return "\"" + code + "\"";
		
		case "parenthesis":
			
			var parenthesis = "(";
			
			for(var count = 0; count < code.length; count++) {
				
				parenthesis += Transpile(code[count][0], code[count][1]);
				
				if(count < code.length - 1) {
					
					parenthesis += " ";
					
				}
				
			}
			
			parenthesis += ")";
			
			return parenthesis;
		
		case "function":
			
			var f_nction = "(function(_){\n";
			
			for(var count = 0; count < code.length; count++) {
				
				f_nction += Transpile("command", code[count]);
				f_nction += ";\n";
				
			}
			
			f_nction += "})";
			
			return f_nction;
		
		case "group":
			
			var group = "(function(){";
			
			for(var count = 0; count < code.length; count++) {
				
				if(count == code.length - 1) {
					
					group += "return (";
					
				}
				
				group += Transpile("command", code[count]);
				
				if(count == code.length - 1) {
					
					group += ");";
					
				} else {
					
					group += ";";
					
				}
				
			}
			
			group += "})()";
			
			return group;
		
		case "list":
			
			var list = "[";
			
			for(var count = 0; count < code.length; count++) {
				
				list += Transpile(code[count][0], code[count][1]);
				
				if(count < code.length - 1) {
					
					list += ", ";
					
				}
				
			}
			
			list += "]";
			
			return list;
		
		
		case "operator":
			
			switch(code) {
				
				case "+":
				case "-":
				case "*":
				case "/":
				case "<":
				case ">":
					
					return code;
				
				case "=":
					
					return "==";
				
				case "!":
					
					return "!=";
				
			}
		
	}
	
	
	
}

Init();