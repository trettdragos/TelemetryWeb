let express = require('express')
let app = express()

const testFolder = './db/';
const fs = require('fs');

let fileArray = [];

fs.readdir(testFolder, (err, files) => {
  files.forEach(file => {
    fileArray.push(file.slice(0, -4));
  });
})

app.get('/', function(req, res){
	console.log(fileArray);
	res.render('pages/file_list.ejs', {fileArray:fileArray});
});

app.get('/:file', function(req, res){
	let lineReader = require('readline').createInterface({
  		input: require('fs').createReadStream('./db/'+req.params.file+'.txt')
	});
	let temps = [];
	let volts = [];
	let rpms = [];
	let gforces = [];
	lineReader.on('line', function (line) {
		let arr = line.split(';');
		let temp = [parseInt(arr[0])*100, parseFloat(arr[1]), parseFloat(arr[2]), parseFloat(arr[3])];
		let volt = [parseInt(arr[0])*100, parseFloat(arr[4]), parseFloat(arr[5])];
		let rpm = [parseInt(arr[0])*100, parseInt(arr[6])];
		let gforce = [parseInt(arr[0])*100, parseFloat(arr[7]), parseFloat(arr[8])];
		gforces.push(gforce);
		rpms.push(rpm);
		temps.push(temp);
		volts.push(volt);
	});

	lineReader.on('close', function(){
		res.render('pages/chart.ejs', {temps:temps, volts:volts, rpms:rpms, gforces:gforces});
	});
});

app.listen(3000, () => console.log('app listening on port 3000!'))