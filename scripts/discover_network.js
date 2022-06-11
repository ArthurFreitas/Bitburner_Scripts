let result_path = "/tmp/hosts.txt";
let visited;
let queue;

/** @param {NS} ns */
export async function main(ns) {
	ns.rm(result_path);
	visited = [];
	queue = ns.getPortHandle(1);

	queue.clear();
	queue.write("home");
	visited.push("home");

	while(!queue.empty()){
		var node = queue.read();
		await visit(ns, node);
	}

	await write_result(ns);
}

async function visit(ns, node){
	var neighbours = ns.scan(node);
	
	for(var i = 0; i < neighbours.length; i++){
		var neighbour = neighbours[i];
		if(!visited.includes(neighbour)){
			visited.push(neighbour);
			queue.write(neighbour);
		}
	}
}

/** @param {NS} ns */
async function write_result(ns){
	await ns.write(result_path, "home", "a");

	for(var i = 1; i < visited.length; i++){
		await ns.write(result_path, "|" + visited[i], "a");
	}
}