class Count {
	
	constructor(code) {
		
		this.code = code;
		
		this.pointer = 0;
		
	}
	
	compile() {
		
		var code = [];
		
		this.skip();
		
		while(this.pointer != this.code.length) {
			
			code.push(this.expect("command"));
			
			this.skip();
			
		}
		
		return code;
		
	}
	
	expect(part) {
		
		switch(part) {
			
			case "command":
				
				var command = this.expect("value");
				var parameter = this.expect("value");
				
				return [command, parameter];
				
			case "value": // The only expectables that aren't here are: "command", "value", and "operator" because they aren't values. 
				
				this.skip();
				
				switch(this.code[this.pointer]) {
					
					case "(": var value = this.expect("parenthesis"); break;
					
					case "0":
					case "1":
					case "2":
					case "3":
					case "4":
					case "5":
					case "6":
					case "7":
					case "8":
					case "9":
						
						var value = this.expect("number");
						break;
						
					case ":": var value = this.expect("string"); break;
					
					case "[": var value = this.expect("function"); break;
					
					case "<": var value = this.expect("list"); break;
					
					case "{": var value = this.expect("group"); break;
					
					case ",":
					case "'":
					
						var value = this.expect("boolean");
						break;
					
					default: var value = this.expect("name"); break;
					
				}
				
				return value;
			
			case "function":
				
				var f_nction = [];
				
				this.pointer++;
				this.skip();
				
				while(this.code[this.pointer] != "]") {
					
					f_nction.push(this.expect("command"));
					
					this.skip();
					
				}
				
				this.pointer++;
				
				return ["function", f_nction];
			
			case "parenthesis":
				
				var parenthesis = [];
				
				this.pointer++;
				this.skip();
				
				var val_or_op = true;
				
				while(this.code[this.pointer] != ")") {
					
					if(val_or_op) {
						
						parenthesis.push(this.expect("value"));
						
					} else {
						
						parenthesis.push(this.expect("operator"));
						
					}
					
					val_or_op = !val_or_op;
					
					this.skip();
					
				}
				
				this.pointer++;
				
				return ["parenthesis", parenthesis];
			
			case "number":
				
				this.skip();
				
				var number = 0;
				
				while(/\d/.test(this.code[this.pointer])) {
					
					number *= 10;
					number += parseInt(this.code[this.pointer]);
					
					this.pointer++;
					
				}
				
				return ["number", number];
			
			case "string":
				
				var string = "";
				
				this.pointer++;
				
				while(this.code[this.pointer] != ";") {
					
					if(this.code[this.pointer] != "`") {
						
						string += this.code[this.pointer];
						
					} else {
						
						this.pointer++;
						
						switch(this.code[this.pointer]) {
							
							case ":": string += ":"; break;
							
							case "`": string += "`"; break;
							
							case ";": string += ";"; break;
							
							case "t": string += "\t"; break;
							
							case "n": string += "\n"; break;
							
							default: string += this.code[this.pointer]; console.warn("Warning: Useless backtick!"); break;
							
						}
						
					}
					
					this.pointer++;
					
				}
				
				this.pointer++;
				
				return ["string", string];
			
			case "list":
				
				var list = [];
				
				this.pointer++;
				this.skip();
				
				while(this.code[this.pointer] != ">") {
					
					list.push(this.expect("value"));
					
					this.skip();
					
				}
				
				this.pointer++;
				
				return ["list", list];
			
			case "name":
				
				this.skip();
				
				var name = "";
				
				while(/[A-Za-z_@]/.test(this.code[this.pointer])) {
					
					name += this.code[this.pointer];
					
					this.pointer++;
					
				}
				
				return ["name", name];
			
			case "group":
				
				var group = [];
				
				this.pointer++;
				this.skip();
				
				while(this.code[this.pointer] != "}") {
					
					group.push(this.expect("command"));
					
					this.skip();
					
				}
				
				this.pointer++;
				
				return ["group", group];
			
			case "boolean":
				
				var boolean = true;
				
				if(this.code[this.pointer] == ",") {
					
					boolean = false;
					
				} else if(this.code[this.pointer] == "'") {
					
					boolean = true;
					
				}
				
				this.pointer++;
				
				return ["boolean", boolean];
			
			case "operator":
				
				var operator = this.code[this.pointer];
				
				this.pointer++;
				return ["operator", operator];
			
		}
		
	}
	
	skip() {
		
		while(this.code[this.pointer] == " " || this.code[this.pointer] == "\t" || this.code[this.pointer] == "\n" || this.code[this.pointer] == "\r") {
				
				this.pointer++;
				
		}
		
	}
	
}