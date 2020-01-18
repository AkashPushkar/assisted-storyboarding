/***********************************************************************************/
/* Event Listeners */

// Draw on mouse events
cv_shadow.addEventListener('mousedown', function(e){
	e.preventDefault();
	if (color==''){
		alert('Please select a category')
	} else {
		let ctx = sc.children[activeLayer].getContext("2d"); 
		engage(e, ctx, tb1_es.value, tb1_lw.value, color);
	}
	
}, false);

cv_shadow.addEventListener('mousemove', function(e){
	e.preventDefault();
	draw(e, sc.children[activeLayer].getContext("2d"));
}, false);


cv_shadow.addEventListener('mouseup', disengage, false);

cv_shadow.addEventListener('mouseleave', disengage, false);


// Draw on touch events
cv_shadow.addEventListener('touchstart', function(e){
	e.preventDefault();
	let ctx = sc.children[activeLayer].getContext("2d"); 
	engage(e, ctx, tb1_es.value, tb1_lw.value, cat);
}, false);

cv_shadow.addEventListener('touchmove', function(e){
	e.preventDefault();
	draw(e, sc.children[activeLayer].getContext("2d"));
}, false);

cv_shadow.addEventListener('touchend', disengage, false);


// Color Palette - Category
for (let k=0; k<cat.length; k++){
	cat[k].addEventListener('click', changeColor);
	cat[k].addEventListener('click', function(e){
		fetchImages(cat[k].nextElementSibling.innerText);

		// activating first element in the prior
		

		if (automaticlayer == 0){
			addLayer(sc);
			updateSliderOptions('add');
			layer3D();
		}
		automaticlayer = 1;
	});

}



/**************************************************************************************************************************************************
		 Toolbar 1 Event Listeners		Toolbar 1 Event Listeners		Toolbar 1 Event Listeners		Toolbar 1 Event Listeners
**************************************************************************************************************************************************/


// Eraser
tb1_er.addEventListener('click', function(e){
	let active_canvas = ctx_shadow;
	erase(e, this, active_canvas);
});


// Undo


// Redo


// Save



// model window - Save
btn_mf_tb1_sv.addEventListener('click', function(e){
	saveCanvas(sc.children[activeLayer].getContext("2d"), ip_mb_tb1_sv.value, element_modal_window_body);
});


// Download



// Copy



// Move
tb1_mv.addEventListener('click', function(e){
	drawing_mode = !drawing_mode
	if (drawing_mode){
		this.style.backgroundColor = "";
	} else{
		this.style.backgroundColor = "#2f3336";
	}
});



// Hide/unhide layers
tb1_vl.addEventListener('click', function(e){
	state3D = !state3D
	if (state3D){
		this.style.backgroundColor = "#2f3336";
	} else{
		this.style.backgroundColor = ""
	}

	layerVisibility(sc);
});



// clear canvas
tb1_cc.addEventListener('click', function(e){
	let ctx = sc.children[activeLayer].getContext("2d");
	clearCanvas(ctx);
	updateSlider();
});


// Add layer
tb1_al.addEventListener('click', function(e){
	addLayer(sc);
	updateSliderOptions('add');
	layer3D();
});


// remove layer
tb1_rl.addEventListener('click', function(e){
	removeLayer(sc);
	updateSliderOptions('remove');
	layer3D();
});

// Fetch Scene
tb1_fs.addEventListener('click', function(e){
	fetchSceneImages(this, sc, fsi)
});


// Resize window
// function called in css_init.js
// window.addEventListener('resize', resize, false);








