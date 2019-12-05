
/********************************************************************************************************
					Global Declaration
********************************************************************************************************/


var ctx_objectInput = c_objectInput.getContext("2d");

var ctx_objectInput_background = c_objectInput_background.getContext("2d");

var rect;


// Drawing line properties 
var paint = false
ctx_objectInput.lineJoin = 'round'
ctx_objectInput.lineCap = 'round'


// Eraser
var eraser = false


// var Drawing mode
var drawing_mode = true

// data to be moved in sc
var move_data

var moving = false
var initial_X, initial_Y
/************************************************************************************************************

@fucntion name: draw

@brief:
	This is for drawing lines

@description:
	For drawing lines

@params:
	event

@return:
	None

*************************************************************************************************************/
var draw = function(e, ctx){
	
	// e.preventDefault();
	if(paint == true){
		switch (e.type){
		case 'mousemove':
			ctx.lineTo(e.clientX - rect.left,  e.clientY - rect.top);
			break;
		case 'touchmove':
			ctx.lineTo(e.touches[0].clientX - rect.left, e.touches[0].clientY - rect.top);
			break;
		}

		ctx.stroke();

		switch (e.type){
		case 'mousemove':
			ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
			break;

		case 'touchmove':
			// alert('come');
			ctx.moveTo(e.touches[0].clientX - rect.left, e.touches[0].clientY - rect.top);
			break;
		}
	}
}


/************************************************************************************************************

@fucntion name: 

@brief:
	
@description:
	
@params:
	event

@return:
	

*************************************************************************************************************/

var engage = function(e, ctx, es, lw, lc){

	// e.preventDefault();
	rect = ctx.canvas.getBoundingClientRect();
	if (eraser){
		ctx.lineWidth = es;
		ctx.strokeStyle = '#ffffff';
	} else {
		ctx.lineWidth = lw;
		ctx.strokeStyle = lc;
	}

	ctx.beginPath();

	switch (e.type){
	case 'mousedown':
		ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
		break;

	case 'touchstart':
		ctx.moveTo(e.touches[0].clientX - rect.left, e.touches[0].clientY - rect.top);
		break;
	}

	paint = true;
}




/************************************************************************************************************
 *
 *@fucntion name: disengage
 *
 *@brief:
 *	 
 *@description:
 *	
 *@params:
 *	event
 *
 *@return:
 * 	
 *
*************************************************************************************************************/


var disengage = function(e){
	e.preventDefault();
	paint = false;
	moving = false;
}


/************************************************************************************************************

@fucntion name: eraser

@brief:
	
@description:
	
@params:
	event

@return:
	

*************************************************************************************************************/


var erase = function(e, btn, ctx){
	eraser = !eraser
	if (eraser){
		btn.style.backgroundColor = "#2f3336";	
		ctx.globalCompositeOperation = 'destination-out';
	} else{
		btn.style.backgroundColor = "";
		ctx.globalCompositeOperation = 'source-over';
	}
}




// Adding image background

var addImage = function(ctx, img){
	
	ctx.drawImage(img, 0, 0, ctx.canvas.width, ctx.canvas.height);
}





// Remove image
var clearCanvas = function(ctx){

	ctx.clearRect(0,0, ctx.canvas.width, ctx.canvas.height)
}



// Clone Element
var cloneElement = function(ctx1, ctx2){
	// img_data_copy = ctx1.toDataURL();
	// var img_copy = new Image();
	// img_copy.src = img_data_copy;

	// var canvas = new fabric.Canvas(ctx2.canvas)

	// var imgInstance = new fabric.Image(img_copy, {
	//   left: 100,
	//   top: 100,
	//   angle: 30,
	//   opacity: 0.85
	// });
	// canvas.add(imgInstance);
	// img_data_copy = ctx1.toDataURL();
	// var img_copy = new Image();
	// img_copy.src = img_data_copy;
	ctx2.drawImage(ctx1, 0, 0, ctx2.canvas.width/1.6, ctx2.canvas.height);
}





// Save Single Canvas

var saveCanvas = function(ctx, name, lib) {
	img_element = ctx.canvas.toDataURL();
	var temp_img = new Image();
	// temp_img.setAttribute('style','border:1px solid black; max-width:100%; height:auto; display:inline');
	temp_img.style.border = "1px solid black";
	temp_img.style.maxWidth = "100%";
	temp_img.style.height = "auto";
	temp_img.style.display = "inline";
	temp_img.src = img_element;

	temp_name = document.createElement("p");
	// temp_name.setAttribute('style','text-align:center');
	name = temp_name.appendChild(document.createTextNode(name));

	gallery_item = document.createElement("div");
	gallery_item.appendChild(temp_img);
	gallery_item.appendChild(name);

	lib.appendChild(gallery_item);

};



// add Layer
var addLayer = function(list, cv){
	var temp = document.createElement("option");
	var value = list.children.length;
	temp.setAttribute('value',(value+1));
	temp.appendChild(document.createTextNode('Layer ' + (value+1)));

	list.appendChild(temp)

	temp = cv.lastElementChild.cloneNode();
	
	temp.style.zIndex = (temp.style.zIndex + 1);
	temp.getContext("2d").lineJoin = 'round';
	temp.getContext("2d").lineCap = 'round';

	cv.appendChild(temp);

	changeSCEventListener(value-1, value);
};


// remove layer
var removeLayer = function(list, cv){
	result = window.confirm("Do you really want to delete the layer? (This will delete the layer and reaarange the layer names)");
	if (result==true){
		changeSCEventListener(list.lastElementChild.value, (list.lastElementChild.value-1));
		cv.removeChild(cv.lastElementChild);
		list.removeChild(list.lastElementChild);

	}
	

}


// Add scene canvas to storyboard
var addScene = function(cv, lib){
	// var img_temp = new Image();
	var temp_btn = document.createElement("button");

	temp_btn.setAttribute("data-toggle","modal");
	temp_btn.setAttribute("data-target","modal");
	var temp_cs = cv.firstElementChild.cloneNode();

	temp_cs = temp_cs.getContext("2d");

	for (var i=0; i < cv.children.length; i++){
		var img_temp = new Image();
		var ctx_temp = cv.children[i].getContext("2d");
		var name = 'Layer' + i;
		var lib_temp = document.getElementById("mb-sb");
		saveCanvas(ctx_temp, name, lib_temp);

		temp_cs.drawImage(ctx_temp.canvas, 0, 0);	

	}

	img_temp.src = temp_cs.canvas.toDataURL();
	img_temp.style.border = "1px solid #000000";
	img_temp.style.width = temp_cs.canvas.width/2 + 'px';
	img_temp.style.height = temp_cs.canvas.height/2 +'px';
	img_temp.style.margin = '3px';

	lib.appendChild(img_temp);
	// temp_btn.innerHTML = img_temp;
	// lib.appendChild(temp_btn);

}



// move the data in a given layer
var moveGetData = function(e, ctx){
	rect = ctx.canvas.getBoundingClientRect();
	initial_X = e.clientX - rect.left;
	initial_Y = e.clientY - rect.top;
	move_data = ctx.getImageData(0,0, ctx.canvas.width, ctx.canvas.height);
	moving = true
}

var movePutData = function(e, ctx){
	if (moving){
		ctx.clearRect(0,0, ctx.canvas.width, ctx.canvas.height);
		ctx.putImageData(move_data, e.clientX-rect.left -initial_X, e.clientY - rect.top-initial_Y);
	}
}


var scEngagePre = function(e){
	e.preventDefault();
	if (drawing_mode == true){
		engage(e, sc.children[tb2_lyr.value-1].getContext("2d"), tb2_es.value, tb2_lw.value, tb2_lc.value);
	} else{
		moveGetData(e, sc.children[tb2_lyr.value-1].getContext("2d"))
	}

};

var scDrawPre = function(e){
	e.preventDefault();
	if (drawing_mode == true){
		draw(e, sc.children[tb2_lyr.value-1].getContext("2d"));
	} else{
		movePutData(e, sc.children[tb2_lyr.value-1].getContext("2d"))
	}
	

};



// Scene Canvas - Active Canvas
var changeSCEventListener = function(previous, current){
	if (sc.children[previous]) {
		sc.children[previous].removeEventListener("mousedown", scEngagePre);
		sc.children[previous].removeEventListener("mousemove", scDrawPre);
		sc.children[previous].removeEventListener("mouseup", disengage);
		sc.children[previous].removeEventListener("mouseleave", disengage);
	}
	sc.children[current].addEventListener("mousedown", scEngagePre);
	sc.children[current].addEventListener("mousemove", scDrawPre);
	sc.children[current].addEventListener("mouseup", disengage);
	sc.children[current].addEventListener("mouseleave", disengage);
};


var rotate3D = function(scene){
	scene.style.perspective = "300px";
	// scene.style.transform = "skewY(20deg)";
	scene.style.transformstyle = "preserve-3D";

	for(var i=0; i<scene.children.length; i++){
		// scene.children[i].style.transformstyle = "preserve-3D"; 
		scene.children[i].style.opacity = (1-i*0.4);
		scene.children[i].style.transform = "matrix(1,0,0,1,"+i*50 +","+ (-i*50)  +")";
	}

};




var fetchImages =  function(categoryName){

	let formData = new FormData();
	formData.append('categoryName', categoryName);
	let csrftoken = Cookies.get('csrftoken');
	// formData.append('csrfmiddlewaretoken', $('#csrf-helper input[name="csrfmiddlewaretoken"]').attr('value'));

	let headers = new Headers();
	headers.append('X-CSRFToken', csrftoken);

	serverURL = '/fetchImages/'

	fetch(serverURL, {
		method : 'POST',
		body : formData,
    	// credentials: 'include',
    	headers : headers
	}).then(function(response){
		return response.blob();
	}).then(function(blob){
			var zip = new JSZip();
			return zip.loadAsync(blob, {createFolders: false});
	}).then(function(zip){
		// a = response.file("file1").async("string");
		zip.forEach(function(relativePath, zipEntry ){
			zipEntry.async("blob").then(function(file){
					let img = new Image();
					let url = URL.createObjectURL(file);
					img.src = url;
					
					i = document.createElement('input');
					i.type = 'radio';
					i.name = 'ai';
					
					l = document.createElement('label');
					l.appendChild(i);
					l.appendChild(img);

					average_images.appendChild(l);

				});
			});

		});

	};




// self-executing anonymous function for activating scene canvas
(function(){
	var previous, current;
	tb2_lyr.addEventListener('focus', function(){
		previous = this.value;
	});

	tb2_lyr.addEventListener('change', function(){
		current = this.value;
		// changeSCEventListener(previous-1, current-1);
	});
	
	window.onload(changeSCEventListener(tb2_lyr.value-1, tb2_lyr.value-1));

	// window.onload(function(){
	// 	sc.children[0].getContext("2d").lineJoin = 'round';
	// 	tb2_lyr.children[0].getContext("2d").lineCap = 'round';		
	// });
	

})();



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


// Clone Element
clone_element.addEventListener('click', function(e){
	var layer = tb2_lyr.value - 1;
	ctx_temp = sc.children[layer].getContext("2d");
	cloneElement(c_objectInput, ctx_temp);
}, false);


// Save Element
btn_mf_tb1_sv.addEventListener('click', function(e){
	saveCanvas(ctx_objectInput, ip_mb_tb1_sv.value, element_modal_window_body);
});


get_images.addEventListener('click', function(e){
	fetchImages(background_image.value)
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


tb2_er.addEventListener('click', function(e){
	erase(e, this, sc.children[tb2_lyr.value-1].getContext("2d"));
});

// Add to storyboard




// 3D
tb2_3D.addEventListener('click', function(e){
	rotate3D(sc);
})