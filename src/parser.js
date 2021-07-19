import { parse as parseExpression } from "equation-parser";

export function convertInput(input) {
	// Do some funky stuff to recognise namespaces and functions without parameters
	let convertedInput = input;

	const instances = convertedInput.match(/math\.\w+/g) ?? [];
	for (const instance of instances) {
		const constantName = instance.replace("math.", "");
		convertedInput = convertedInput.replace(constantName, constantName + "()");
	}

	const ast = parseExpression(convertedInput.replace("math.", ""));

	return `${traverseASTNode(ast)}; // Original Expression: ${input}`;
}

function traverseASTNode(node) {
	const hasNestedNodes = (object) =>
		Object.values(object).some((value) => value.type);

	// Check if
	if (!hasNestedNodes(node)) return decideReturnFromType(node);

	// Special types - blocks, unary expressions
	switch (node.type) {
		case "block":
			return traverseASTNode(node.child);
		case "positive":
			return `math.add(0, ${traverseASTNode(node.value)})`;
		case "negative":
			return `math.sub(0, ${traverseASTNode(node.value)})`;
		case "positive-negative":
			return `math.mul(${traverseASTNode(node.value)}, -1)`;
		case "parser-error":
			throw node;
		case "matrix":
			return;
		default:
	}

	// Binary expression mapper:
	const binaryExpressionData = {
		plus: "math.add",
		minus: "math.sub",
		multiply: "math.mul",
		divide: "math.div",
		power: "math.pow",
		equals: "math.eq",
		less: "math.lt",
		greater: "math.gt",
	};

	const typeNameArray = node.type.split("-");
	const functionName = binaryExpressionData[typeNameArray[0]];

	// Get first word of type to map to script function
	if (functionName) {
		return `${functionName}${
			typeNameArray[2] === "equals" ? "e" : ""
		}(${traverseASTNode(node.a)}, ${traverseASTNode(node.b)})`;
	}

	return;
}

function decideReturnFromType(node) {
	switch (node.type) {
		case "variable":
			return node.name;
		case "number":
			return node.value;
		case "function":
			return `math.${node.name}${
				node.args.length
					? "(" + node.args.map((arg) => traverseASTNode(arg)) + ")"
					: ""
			}`;
		case "parser-error":
			throw node;
		default:
			return;
	}
}
