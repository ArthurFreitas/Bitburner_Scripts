/** @param {NS} ns */
export async function main(ns) {
	var target = ns.args[0];
	await ns.write(target + ".txt", target);
	await ns.scp(target + ".txt", "hosts");

	var maxRam = ns.getServerMaxRam(target);
	var neededRam = ns.getScriptRam("/worm/miner.js", "production");
	var maxThreads = Math.floor(maxRam/neededRam);
	ns.spawn("worm/miner.js", maxThreads, target);
}