const axios = require('axios');

function niceCapitalize(text) {
	let niceText = "";
	text.split(" ").forEach((a) => { niceText += a[0].toUpperCase() + a.substring(1, a.length).toLowerCase() + " "; });
	return niceText.substring(0, niceText.length - 1);
}

function cleanRound (num, dec) {
	return Math.floor(num * Math.pow(10, dec)) / Math.pow(10, dec);
}

module.exports.calculate = async function (number) {

const res = await axios.get('https://api.skyblock.bz/api/flips');

const flips = res.data

let array = []

for (let i = 0; i < Math.min(number, flips.length); i++) {
	let settings = flips[i]
	let marginprecent = cleanRound(settings.margin / settings.sellprice * 100, 2);

	array.push("**#" + (i + 1) + "**: `" + niceCapitalize(settings.name) + ` (${flips[i].id}) ` + "` (`$"  + cleanRound(settings.sellprice * 1024, 1) + "` profit per 1024x)", "Margin: `" + cleanRound(settings.margin, 1) + " (" + marginprecent + "%)` Sell price: `$" + cleanRound(settings.sellprice * 1024, 1).toLocaleString() + "  → $" + cleanRound(settings.sellprice * 0.9875 * 1024, 1).toLocaleString() + "`\n");
}
return array
}

module.exports.bestid = async function () {
	const res = await axios.get('https://api.skyblock.bz/api/flips');

	const flips = res.data

	return flips[0].id
}