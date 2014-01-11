var obj = (function(){
    var me = [];
    var CANVAS_WIDTH = 600;
    var CANVAS_HEIGHT = 450;
    

    var init = function(){
	//create canvas
	me.cvs_bg   = create_canvas('background');
	me.cvs_paper        = create_canvas('paper');
	me.cvs_zoom = create_canvas('for_zoomed_img');

	//create context
	me.cvs_bg_ctx = me.cvs_bg.getContext("2d");
	me.cvs_paper_ctx = me.cvs_paper.getContext("2d");
	me.cvs_zoom_ctx = me.cvs_zoom.getContext("2d");
	draw_background(me.cvs_zoom_ctx);
	me.cvs_zoom.addEventListener('mousedown',onMouseDown,false);
	/*me.cvs_paper_ctx.moveTo(0,0);
	me.cvs_paper_ctx.lineTo(600,450);
	me.cvs_paper_ctx.stroke();*/

	/*me.canvas = $('#cvs')[0];
	me.context = me.canvas.getContext("2d");
	me.canvas_temp1 = $('#cvs_temp1')[0];
	me.context_temp1 = me.canvas_temp1.getContext("2d");
	me.canvas_temp2 = $('#cvs_temp2')[0];
	me.context_temp2 = me.canvas_temp2.getContext("2d");
	addlistner(me.canvas);
	drawsampleline();*/
    };
    var draw_background = function(background){
	    var w = CANVAS_WIDTH/10;
	    for (var i=0; i < 10; i++){
		background.moveTo(w * i, 0);
		background.lineTo(w * i, CANVAS_HEIGHT);
	    }
	    var h = CANVAS_HEIGHT/10;
	    for (var i=0; i < 10; i++){
		background.moveTo(0, h*i);
		background.lineTo(CANVAS_WIDTH, h*i);
	    }
	    background.stroke();
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
    var drawsampleline = function(){
	
    };
    
    var restore_background = function(){
	me.context.clearRect(0,0,300,150);
	me.context.putImageData(me.background, 0,0);
    };
    var draw_line = function(mousePos){
	me.context.beginPath();
	me.context.moveTo(me.lastMousePos.x, me.lastMousePos.y);
	me.context.lineTo(mousePos.x, mousePos.y);
	me.context.stroke();
	me.context.closePath();
	me.lastMousePos = {x:mousePos.x, y:mousePos.y};
    };
    var store_zoomed_image_to_canvas2 = function(mousePos){
	var imgData = me.context.getImageData(mousePos.x-25, mousePos.y-25, 50, 50);
	me.context_temp1.putImageData(imgData,0,0);
	me.context_temp2.save();
	me.context_temp2.scale(2,2);
	me.context_temp2.clearRect(0,0,300,150);
	me.context_temp2.drawImage(me.canvas_temp1,0,0);
	me.context_temp2.restore();
    };
    var draw_circle = function(ctx, mousePos){
	ctx.beginPath();
	ctx.arc(mousePos.x, mousePos.y, 25, 25, Math.PI*2, true);
	ctx.stroke();
	ctx.closePath();
    };
    var clip_circle = function(mousePos){
	me.context.beginPath();
	me.context.fillStyle = "white";
	me.context.arc(mousePos.x, mousePos.y, 25, 25, Math.PI*2, true);
	me.context.fill();
	me.context.closePath();
	me.context.clip();
    };
    var draw_zoomed_image = function(mousePos){
	store_zoomed_image_to_canvas2(mousePos);
	me.context.save();
	clip_circle(mousePos);
	me.context.drawImage(me.canvas_temp2,mousePos.x-50, mousePos.y-50,300,150);
	me.context.restore();
	draw_circle(mousePos);
    };
    //you should make it to prototype for the performance
    var onMouseDown = function(evt) {
	    console.log('clicked');
	    var mousePos = getMousePos(evt);
	    console.log(mousePos);
	    draw_circle(me.cvs_zoom_ctx, mousePos);

	    /*
	    me.cvs_paper_ctx.beginPath();
	    me.cvs_paper_ctx.moveTo(mousePos.x, mousePos.y);
	    me.cvs_zoom.addEventListener('mousemove',onMouseMove , false);
	    //me.cvs_zoom.addEventListener('mouseup', me.cvs_paper_ctx.closePath, false);
	    me.cvs_zoom.addEventListener('mouseup', mouseup, false);*/
    };
    var onMouseMove = function(evt){
	console.log('moved');
	var mousePos = getMousePos(evt);
	console.log(mousePos);
	//me.cvs_paper_ctx.lineTo(mousePos.x, mousePos.y);
	//
	//me.cvs_paper_ctx.moveTo(10,10);
	//me.cvs_paper_ctx.lineTo(600,0);
	me.cvs_paper_ctx.lineTo(evt.clientX, evt.clientY);
	me.cvs_paper_ctx.stroke();
    };
    var getMousePos = function(evt) {
	var rect = me.cvs_paper.getBoundingClientRect();
	return {
	    x: evt.clientX - rect.left,
		y: evt.clientY - rect.top
	};
    };
    var addlistner = function(){
	me.canvas.addEventListener('mousedown',prepareToDraw , false);
	me.canvas.addEventListener('mouseup', function(evt) {
	    mouseup();
	}, false);
    };
    var mouseup = function(){
	/*me.context.clearRect(0,0,300,150);
	me.context.putImageData(me.background, 0,0);
	me.canvas.removeEventListener('mousemove',draw, false);*/
	console.log('mouseup');
	me.cvs_zoom.removeEventListener('mousemove', onMouseMove, false);
	me.cvs_paper_ctx.closePath();
	
    };
    window.onload = init;
})();
