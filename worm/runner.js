/** @param {NS} ns */
export async function main(ns) {
	var target = ns.args[0];
	var targetfile = "/hosts/" + target + ".txt";
	var targetMoney = ns.getServerMoneyAvailable(target);

	await ns.write(targetfile, targetMoney);
	await ns.scp(targetfile, "home");
	ns.rm(targetfile, target);

	if(targetMoney > 0){
		var maxRam = ns.getServerMaxRam(target);
		var neededRam = ns.getScriptRam("/worm/miner.js", "production");
		var maxThreads = Math.floor(maxRam/neededRam);
		ns.spawn("worm/miner.js", maxThreads, target);
	}
}