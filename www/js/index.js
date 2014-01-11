var obj = (function(){
    var me = [];
    var CANVAS_SIZE = {w:600, h:450};
    me.mpower = 2;

    var init = function(){
	//create canvas
	me.cvs_bg   = create_canvas('background');
	me.cvs_paper        = create_canvas('paper');
	me.cvs_zoom = create_canvas('zoom');
	me.cvs_temp = create_canvas('temp');

	//create context
	me.cvs_bg_ctx = me.cvs_bg.getContext("2d");
	me.cvs_paper_ctx = me.cvs_paper.getContext("2d");
	me.cvs_zoom_ctx = me.cvs_zoom.getContext("2d");
	me.cvs_temp_ctx = me.cvs_temp.getContext("2d");

	//set attributes
	setCanvasSize(me.cvs_bg, CANVAS_SIZE);
	setCanvasSize(me.cvs_paper, CANVAS_SIZE);
	setCanvasSize(me.cvs_zoom, CANVAS_SIZE);
	setCanvasSize(me.cvs_temp, CANVAS_SIZE);
	me.cvs_temp.setAttribute('style', "display:none");

	draw_background(me.cvs_bg_ctx);

	me.cvs_zoom.addEventListener('touchstart',prepareToDraw, false);
    };
    var draw_background = function(bg_context){
	bg_context.beginPath();
	for ( i=0; i < CANVAS_SIZE['w']/10; i++){
	    bg_context.moveTo(CANVAS_SIZE['w']/10 * i, 0);
	    bg_context.lineTo(CANVAS_SIZE['w']/10 * i, CANVAS_SIZE['h']);
	}
	for ( i=0; i < CANVAS_SIZE['h']/10; i++){
	    bg_context.moveTo(0, CANVAS_SIZE['h']/10 * i);
	    bg_context.lineTo( CANVAS_SIZE['w'], CANVAS_SIZE['h']/10 * i);
	}
	bg_context.stroke();
	bg_context.closePath();
    };
    var prepareToDraw = function(evt){
	mousepos = getMousePos(evt);
	me.cvs_paper_ctx.beginPath();
	me.cvs_paper_ctx.moveTo(mousepos.x,mousepos.y);
	add_magnifier(mousepos);
	me.cvs_zoom.addEventListener('touchmove', draw, false);
	me.cvs_zoom.addEventListener('touchend', finishDrawing, false);
	//draw_circle(me.cvs_paper_ctx, mousepos);
    };
    var finishDrawing = function(){
	me.cvs_zoom_ctx.clearRect(0, 0, CANVAS_SIZE["w"], CANVAS_SIZE["h"]);
	me.cvs_zoom.removeEventListener('touchmove', draw, false);
    };
    var draw = function(evt){
	me.cvs_zoom_ctx.clearRect(0, 0, CANVAS_SIZE["w"], CANVAS_SIZE["h"]);
	var mousepos = getMousePos(evt);
	me.cvs_paper_ctx.lineTo(mousepos.x, mousepos.y);
	me.cvs_paper_ctx.stroke();

	add_magnifier(mousepos);
	
    };
    var add_magnifier = function(mousepos){
	draw_circle(me.cvs_zoom_ctx, mousepos);
	me.cvs_zoom_ctx.save();
	clip_circle(me.cvs_zoom_ctx, mousepos);
	var imgData = me.cvs_paper_ctx.getImageData(mousepos.x-25, mousepos.y-25, 50, 50);
	me.cvs_temp_ctx.putImageData(imgData,0,0);

	var pos_x = mousepos.x-(25 * me.mpower);
	var pos_y = mousepos.y-(25 * me.mpower);
	me.cvs_zoom_ctx.drawImage(me.cvs_temp,pos_x,pos_y, CANVAS_SIZE['w']*me.mpower, CANVAS_SIZE['h']*me.mpower);
	me.cvs_zoom_ctx.restore();
    };
    var clip_circle = function(context, mousePos){
	context.beginPath();
	context.fillStyle = "white";
	context.arc(mousePos.x, mousePos.y, 25, 25, Math.PI*2, true);
	context.fill();
	context.closePath();
	context.clip();
    };
    var draw_circle = function(ctx, mousePos){
	ctx.beginPath();
	ctx.arc(mousePos.x, mousePos.y, 25, 25, Math.PI*2, true);
	ctx.stroke();
	ctx.closePath();
    };
    var setCanvasSize = function(canvas, size){
	canvas.setAttribute('width', size["w"]);
	canvas.setAttribute('height', size["h"]);
    };
    var create_canvas = function(id){
	var cvs_id ='cvs_' + id;
	var cvs = document.createElement('canvas');
	cvs.id = cvs_id;
	//console.log(cvs);
	$('div#canvas')[0].appendChild(cvs);
	console.log($('#' + cvs_id)[0]);

	return $('#' + cvs_id)[0];
    };
    var getMousePos = function(e) {
	var pos_x =e.changedTouches[0].clientX;
	var pos_y =e.changedTouches[0].clientY;

	var rect = me.cvs_zoom.getBoundingClientRect();
	return {
	    x: pos_x - rect.left,
		y: pos_y - rect.top
	};
    };
    window.onload = init;
})();
