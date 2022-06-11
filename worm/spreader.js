let hackeablePorts = 4;

/** @param {NS} ns */
export async function main(ns) {
	var host = ns.args[0]
	var neighbours = ns.scan();

	for (var i = 0; i < neighbours.length; i++) {
		await tryToSpread(ns, neighbours[i]);
	}

	ns.spawn("worm/runner.js", 1, host)
}

async function tryToSpread(ns, neighbour) {
	if (canSpread(ns, neighbour) && shouldSpread(ns, neighbour)) {
		await spread(ns, neighbour);
	}
}

function canSpread(ns, neighbour) {
	var minHackingLVL = ns.getServerRequiredHackingLevel(neighbour);
	var currentHackingLVL = ns.getHackingLevel();

	return currentHackingLVL >= minHackingLVL && canNuke(ns, neighbour);
}

function canNuke(ns, neighbour) {
	return hackeablePorts >= ns.getServerNumPortsRequired(neighbour);
}

function shouldSpread(ns, neighbour) {
	return !ns.fileExists(neighbour + ".txt", "hosts");
}

async function spread(ns, neighbour) {
	ns.print("Spreading to " + neighbour);
	var initFile = "init.js";

	await ns.scp(initFile, "production", neighbour);
	ns.exec(initFile, neighbour, 1, neighbour);
}