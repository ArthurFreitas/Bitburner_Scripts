let reportPath = "/stats/summary.txt"

/** @param {NS} ns */
export async function main(ns) {
	await clearFile(ns);
	await discover_network(ns);
	
	var knownHosts = getKnownHosts(ns);
	for(var i = 0; i < knownHosts.length; i++){
		await writeStatsForNode(ns, knownHosts[i]);
	}
}

async function discover_network(ns){
	ns.run("/scripts/discover_network.js");
	await ns.sleep(2000);
}

function getKnownHosts(ns){
	var known_hosts = ns.read("/tmp/hosts.txt");
	return known_hosts.split("|");
}

async function writeStatsForNode(ns, node){
	var server = ns.getServer(node);

	if(!server.purchasedByPlayer){
		var organizationName = server.organizationName;
		var hasAdminRights = server.hasAdminRights;
		var numOpenPortsRequired = server.numOpenPortsRequired;
		var maxRam = server.maxRam;
		var requiredHackingSkill = server.requiredHackingSkill;
		var backdoorInstalled = server.backdoorInstalled;

		var maxMoney = server.moneyMax;
		var moneyThresh = Math.floor(maxMoney * 0.75);
		var currentMoney = Math.floor(server.moneyAvailable);
		var serverGrowth = server.serverGrowth;

		var minSecurity = server.minDifficulty;
		var securityThresh = minSecurity + 5;
		var currentSecurity = server.hackDifficulty;

		await writeLine(ns, node);
		await writeLine(ns, "--Organization: " + organizationName);
		await writeLine(ns, "--Root Access: " + hasAdminRights);
		await writeLine(ns, "--Required hacking skill: " + requiredHackingSkill);
		await writeLine(ns, "--Ports required to NUKE: " + numOpenPortsRequired);
		await writeLine(ns, "--RAM: " + maxRam);
		await writeLine(ns, "--Backdoor: " + backdoorInstalled);
		
		await writeLine(ns, "");

		await writeLine(ns, "--Current/Max Money: " + currentMoney + "/" + maxMoney);
		await writeLine(ns, "--Max Money Digits: " + maxMoney.toString().length)
		await writeLine(ns, "--Money Min Treshhold: " + moneyThresh);
		await writeLine(ns, "--Money Growth: " + serverGrowth);
		
		await writeLine(ns, "");

		await writeLine(ns, "--Current/Min Security: " + currentSecurity + "/" + minSecurity);
		await writeLine(ns, "--Security Max Treshhold: " + securityThresh);

		await writeLine(ns, "----------------------------------------------");	
	}
}

async function clearFile(ns){
	await ns.write(reportPath, "", "w");
}

async function writeLine(ns, data){
	await ns.write(reportPath, data + "\n", "a");
}