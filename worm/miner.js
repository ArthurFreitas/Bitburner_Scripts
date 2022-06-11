/** @param {NS} ns */
export async function main(ns) {
	var target = ns.args[0];
    var moneyThresh = ns.getServerMaxMoney(target) * 0.75;
    var securityThresh = ns.getServerMinSecurityLevel(target) + 5;

    while(true) {
		var currentSecurity = ns.getServerSecurityLevel(target);
		var currentMoney = ns.getServerMoneyAvailable(target);

        var weakenIterationsLeft = Math.ceil((currentSecurity - securityThresh) / 0.05)
        var growthIterationsLeft = Math.ceil((moneyThresh - currentMoney) / ns.getServerGrowth(target));

        if (currentSecurity > securityThresh) {
			ns.print("Weaking: " + weakenIterationsLeft + " iterations left ")
            await ns.weaken(target);
        } else if (currentMoney < moneyThresh) {
			ns.print("Growing: " + growthIterationsLeft + " iterations left ")
            await ns.grow(target);
        } else {
			ns.print("Hacking for " + ns.getHackTime())
            await ns.hack(target);
        }
    }
}