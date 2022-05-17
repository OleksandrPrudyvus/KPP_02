module.exports.points = {
	'current': getRandomInt(10000)
}

function getRandomInt(number){
	let arr = new Array();
	for(let x = 0; x < number; x+=1){
		arr[x] = [Math.floor(Math.random()* (99 - 1) + 1), Math.floor(Math.random() * (99 - 1) + 1)]
	}
	return arr
}
console.log(typeof(getRandomInt(100)))