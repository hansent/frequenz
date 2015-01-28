var $ = require('jquery');
var frequenz = require('./frequenz');


function simple(frequencyData){
	sum = 0;
	for (var i = 0; i < frequencyData.length; i++) {
	    sum += frequencyData[i];
	}
	$(".simple").width(sum / frequencyData.length);
}



function renderBins(ctx, freq){
	var w = ctx.canvas.width;
	var h = ctx.canvas.height;

	//clear canvas
	ctx.setTransform(1, 0, 0, 1, 0, 0);
	ctx.clearRect(0, 0, w, h);

	//set color of bars
	ctx.translate(0,h);	
	ctx.scale(1,-h);
	var binWidth = w/freq.length

	for(var i=0; i<freq.length; i++){
		ctx.fillStyle = "#cccccc";
		ctx.fillRect(1,0,binWidth-1, 1);
		ctx.fillStyle = "#000000";
		ctx.fillRect(1,0,binWidth-1, freq[i]/256.0);
		ctx.translate(binWidth, 0);
	}



}


$(function(){

	var binsDiv = $(".bins");
	var canvas = document.createElement( 'canvas' );
	canvas.width = binsDiv.width();
	canvas.height = binsDiv.height();
	binsDiv.append(canvas);
	ctx = canvas.getContext( '2d' );



	//play souns and analyse audio signal as it is coming in
	frequenz('assets/music.ogg', function(e, analyser){
		//get frequency data / FFT output
		var frequencyData = new Uint8Array(analyser.frequencyBinCount);
		analyser.getByteFrequencyData(frequencyData);

		//visualize / render / update graphics
		simple(frequencyData);
		renderBins(ctx, frequencyData);
	});


 })






