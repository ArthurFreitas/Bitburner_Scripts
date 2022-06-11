/** @param {NS} ns */
export async function main(ns) {
	await push(ns);
	await deploy(ns);
}

async function push(ns){
	var production = "production";
	var wormFiles = ns.ls("home", "worm");

	await ns.scp("init.js", "home", production);
	await ns.scp(wormFiles, "home", production);
}

async function deploy(ns){
	var hosts = ns.ls("hosts");
	var initFile = "init.js"

	for (var i = 0; i < hosts.length; i++) {
		var host = hosts[i];
		host = host.substr(0, host.length - 4);

		ns.killall(host);

		ns.rm(initFile, host);
		await ns.scp(initFile, "production", host);
		ns.exec(initFile, host, 1, host);
	}
}