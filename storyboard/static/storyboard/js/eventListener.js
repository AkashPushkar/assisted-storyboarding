/***********************************************************************************/
/* Event Listeners */

// Draw on mouse events
c_objectInput.addEventListener('mousedown', function(e){
	e.preventDefault();
	engage(e, ctx_objectInput, tb1_es.value, tb1_lw.value, tb1_lc.value);
}, false);

c_objectInput.addEventListener('mousemove', function(e){
	e.preventDefault();
	draw(e, ctx_objectInput);
}, false);


c_objectInput.addEventListener('mouseup', disengage, false);

c_objectInput.addEventListener('mouseleave', disengage, false);


// Draw on touch events
c_objectInput.addEventListener('touchstart', function(e){
	e.preventDefault();
	engage(e, ctx_objectInput, tb1_es.value, tb1_lw.value, tb1_lc.value);
}, false);

c_objectInput.addEventListener('touchmove', function(e){
	e.preventDefault();
	draw(e, ctx_objectInput);
}, false);

c_objectInput.addEventListener('touchend', disengage, false);


// clear canvas
clear_canvas.addEventListener('click', function(e){
	clearCanvas(ctx_objectInput);
});


// Remove background image canvas 1
remove_background_image.addEventListener('click', function(e){
	clearCanvas(ctx_objectInput_background);
}, false);



// Eraser button for tb1
eraser_button.addEventListener('click', function(e){
	erase(e, this, ctx_objectInput)
});


// Add image on Object Canvas Layer 0
add_background_image.addEventListener('click', function(e){
	// var img = new Image();
	// img.src = './images/' + document.getElementById("background_image").value + '.png';
	let ai = document.getElementsByName('ai');
	for(let i=0; i <ai.length ; i++){
		if (ai[i].checked){
			var img = ai[i].nextSibling;
			break;
		}
	}
	
	addImage(ctx_objectInput_background, img)
} , false);



// add exemplar background 
add_exemplar_background.addEventListener('click', function(e){
	let ai = document.getElementsByName('ei');
	
	for(let i=0; i <ai.length ; i++){
		if (ai[i].checked){
			var img = ai[i].nextSibling;
			break;
		}
	}
	
	addImage(ctx_objectInput_background, img)
}, false);


// clone_element.addEventListener('click', function(e){
// 	var layer = tb2_lyr.value - 1;
// 	ctx_temp = sc.children[layer].getContext("2d");
// 	cloneElement(c_objectInput, ctx_temp);
// }, false);


// Clone Element
clone_element.addEventListener('click', function(e){
	addLayer(tb2_lyr, sc);
	let layer = tb2_lyr.length;
	tb2_lyr.value = layer;
	ctx_temp = sc.children[layer-1].getContext("2d");
	cloneElement(c_objectInput, ctx_temp);
}, false);


// Save Element
btn_mf_tb1_sv.addEventListener('click', function(e){
	saveCanvas(ctx_objectInput, ip_mb_tb1_sv.value, element_modal_window_body);
});

// get average images
get_images.addEventListener('click', function(e){
	fetchImages(background_image.value)
});

// get exemplar images
get_exemplar_images.addEventListener('click', function(e){

	let ai = document.getElementsByName('ai');
	let clusterName
	for(let i=0; i <ai.length ; i++){
		if (ai[i].checked){
			clusterName = ai[i].value;
			break;
		}
	}

	fetchExemplarImages(clusterName+'_edge');
});


// Resize window
// function called in css_init.js
window.addEventListener('resize', resize, false);






/**************************************************************************************************************************************************
		 Toolbar 2 Event Listeners		Toolbar 2 Event Listeners		Toolbar 2 Event Listeners		Toolbar 2 Event Listeners
**************************************************************************************************************************************************/



// clear canvas

tb2_cc.addEventListener('click', function(){
	clearCanvas(sc.children[(tb2_lyr.value-1)].getContext("2d"));
});



// Add layer
tb2_al.addEventListener('click', function(){
	addLayer(tb2_lyr, sc);
});


// Remove Layer
tb2_rl.addEventListener('click', function(e){
	removeLayer(tb2_lyr, sc);
});


// Add scene
tb2_as.addEventListener('click', function(e){
	addScene(sc, sb)
});


// Move data
tb2_mv.addEventListener('click', function(e){
	drawing_mode = !drawing_mode
	if (drawing_mode){
		this.style.backgroundColor = "";
	} else{
		this.style.backgroundColor = "#2f3336";
	}
});


// Eraser sc
tb2_er.addEventListener('click', function(e){
	erase(e, this, sc.children[tb2_lyr.value-1].getContext("2d"));
});



// Scaling a sc layer
// tb2_sc.addEventListener('change', function(e){
// 	if (drawing_mode){
// 		scale(this, sc.children[tb2_lyr.value-1].getContext("2d"))
// 	}
// });


// Scaling a sc layer plus
tb2_sc_plus.addEventListener('click', function(e){
	if (drawing_mode){
		scale(this, sc.children[tb2_lyr.value-1].getContext("2d"), 1.1);
	}
});

// Scaling a sc layer plus
tb2_sc_minus.addEventListener('click', function(e){
	if (drawing_mode){
		scale(this, sc.children[tb2_lyr.value-1].getContext("2d"), 0.3);
	}
});


// Drawing assistance, activating the current and adding opacity to other layers
tb2_lyr.addEventListener('focus', function(){
		sc.children[parseInt(tb2_lyr.value)-1].style.opacity = "0.3";
}, false);

tb2_lyr.addEventListener('blur', function(){
	sc.children[parseInt(tb2_lyr.value)-1].style.opacity = "";
}, false);



// 3D effect
tb2_3D.addEventListener('click', function(e){
	state3D = !state3D
	effect3D(this, sc);
});


// 
tb2_fs.addEventListener('click', function(e){
	fetchSceneImages(this, sc, fsi)
});


tb2_3d_lyr.addEventListener('click', layer3D);


tb2_3D_r.addEventListener('click', function(e){
	effect3D_right(sc, 5);
});

tb2_3D_l.addEventListener('click', function(e){
	effect3D_right(sc, -5);
});
