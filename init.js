/** @param {NS} ns */
export async function main(ns) {
	var target = ns.args[0];
	ns.killall(target, true);

	if (!ns.hasRootAccess(target)) {
		getRootAccess(ns, target);
	}

	await copyWorm(ns, target)

	ns.spawn("worm/spreader.js", 1, target);
}

function getRootAccess(ns, target) {
	var portsRequired = ns.getServerNumPortsRequired(target);

	if (portsRequired >= 1) {
		ns.brutessh(target)
	}

	if (portsRequired >= 2) {
		ns.ftpcrack(target)
	}

	if (portsRequired >= 3) {
		ns.relaysmtp(target)
	}

	if (portsRequired >= 4) {
		ns.sqlinject(target)
	}

	ns.nuke(target)
}

async function copyWorm(ns, target) {
	var wormFiles = ns.ls("production", "worm")

	for(let i = 0; i < wormFiles.length; i = i + 1) {
        ns.rm(wormFiles[i], target)
    }

	await ns.scp(wormFiles, "production", target)
}