
/********************************************************************************************************
					Global Declaration
********************************************************************************************************/

// Context shadow canvas
var ctx_shadow = cv_shadow.getContext("2d");

var rect;

// Drawing line properties 
var paint = false
ctx_shadow.lineJoin = 'round'
ctx_shadow.lineCap = 'round'

// Eraser
var eraser = false


// automatic layer  tracking 
var automaticlayer = 0;


// Drawing mode (boolean)
var drawing_mode = true

// data to be moved in sc
var move_data

var moving = false
var initial_X, initial_Y

let state3D = false

let flag;
// Slider 
var unconstrainedSlider = document.getElementById('sl-lyr');

var color = '';

options = {
	start: [1],
    behaviour: 'unconstrained-tap',
    // connect: true,
    step: 1,
    tooltips: [true],
    range: {
        'min': 0,
        'max': 20
    }
};

noUiSlider.create(unconstrainedSlider, options);

var activeLayer = 0;

// Draw
var draw = function(e, ctx){
	

	// e.preventDefault();
	automaticlayer = 0;
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
		
		if (socket.readyState == 1){
			let img = ctx.canvas.toDataURL('image/png');
			socket.send(img)
		}

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

// Starting mouse pointer
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

// Stopping mouse pointer
var disengage = function(e){
	e.preventDefault();
	paint = false;
	moving = false;
	updateSlider()
}

// Eraser (on/off)
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



var changeColor = function(){
	let q = document.querySelectorAll('input[name="cat"]:checked')[0];
	color = q.value;
	tb1_sc.innerHTML = q.nextElementSibling.innerHTML;
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
var addLayer = function(cv){

	temp = cv.lastElementChild.cloneNode();
	temp.style.zIndex = (parseInt(temp.style.zIndex) + 1);
	temp.getContext("2d").lineJoin = 'round';
	temp.getContext("2d").lineCap = 'round';
	cv.appendChild(temp);

	if (cv.childElementCount > 1){
		tb1_rl.disabled = false;
	}
	
};


// remove layer
var removeLayer = function(list){
	result = window.confirm("Do you really want to delete the active layer?");
	if (result==true){
		list.removeChild(list.children[activeLayer]);
	}

	if (list.childElementCount == 1){
		tb1_rl.disabled = true;
	}
}


// Clear Canvas
var clearCanvas = function(ctx){
	ctx.clearRect(0,0,ctx.canvas.width, ctx.canvas.height);
}


// Add scene canvas to storyboard
var addScene = function(cv, lib){

	let temp_cs = cv.firstElementChild.cloneNode();
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

}



// 3d visualization of the canvas
var layerVisibility = function(scene){
	if (state3D == true){
		for(var i=0; i<scene.children.length; i++){
			if (i != activeLayer){
				scene.children[i].style.opacity = "0";
			}
		}
	} else {
		for(var i=0; i<scene.children.length; i++){
			scene.children[i].style.opacity = "";
		}
	} 
};


// Scaling of layer
var scale = function(btn, ctx, change){

	let cv = new OffscreenCanvas(ctx.canvas.width, ctx.canvas.height)
	cv = cv.getContext("2d")
	cv.drawImage(ctx.canvas, 0, 0)
	ctx.clearRect(0,0,ctx.canvas.width, ctx.canvas.width)
	ctx.drawImage(cv.canvas, 0, 0, change*ctx.canvas.width , change*ctx.canvas.height)
}


var updateSliderOptions = function(type){
	let loc = unconstrainedSlider.noUiSlider.get();
	// console.log(typeof(loc));
	if (type == 'add'){
		if (sc.children.length >= 3){
			loc.push("0.00");
			options.start = loc;
		} else if (sc.children.length == 2){
			loc = Array(loc);
			loc.push("0.00");
			options.start = loc;
		}
	} else if (type == "remove"){
		loc.splice(activeLayer, 1);
		options.start = loc;
		activeLayer = 0;
	}
	
	options.tooltips = Array(sc.childElementCount).fill(true);

}




var layer3D = function(){

	unconstrainedSlider.noUiSlider.destroy();
	noUiSlider.create(unconstrainedSlider, options);

	let handles = document.getElementsByClassName('noUi-handle');
	let w = sc.children[0].width/4;
	let h = sc.children[0].height/4;

	for (let i=0; i<sc.children.length; i++){

		let cv_temp = document.createElement('canvas');
		cv_temp.width = w;
		cv_temp.height = h;

		cv_temp.getContext("2d").drawImage(sc.children[i], 0,0, w, h);
		let url = cv_temp.toDataURL("image/jpg");

		handles[i].style.backgroundImage = 'url('+url+')';
		handles[i].style.width = w + 'px';
		handles[i].style.height = h +'px';
		handles[i].style.opacity = '0.8';
		handles[i].style.transform = 'skew(0deg, 20deg)';
	}

	handles[activeLayer].style.border = "5px solid red";

    unconstrainedSlider.noUiSlider.on('end', function(values, handle){
    	handles[activeLayer].style.border = "";
    	if (state3D == true){
    		sc.children[activeLayer].style.opacity = "0";
    	}

    	activeLayer = handle;

    	handles[activeLayer].style.border = "5px solid red";
    	if (state3D == true){
    		sc.children[activeLayer].style.opacity = "";
    	}

    });
	
};


var updateSlider = function(){
	let handles = document.getElementsByClassName('noUi-handle');
	
	let w = sc.children[0].width/4;
	let h = sc.children[0].height/4;

	let cv_temp = document.createElement('canvas');
	cv_temp.width = w;
	cv_temp.height = h;

	cv_temp.getContext("2d").drawImage(sc.children[activeLayer], 0,0, w, h);
	let url = cv_temp.toDataURL("image/jpg");
	
	handles[activeLayer].style.backgroundImage = 'url('+url+')';
}



// fetch images for object canvas
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
		let index = 0;
		prior.querySelectorAll('*').forEach(n => n.remove());
		// a = response.file("file1").async("string");
		zip.forEach(function(relativePath, zipEntry ){
			zipEntry.async("blob").then(function(file){
					let img = new Image();
					let url = URL.createObjectURL(file);
					img.src = url;
					
					i = document.createElement('input');
					i.type = 'radio';
					i.name = 'ai';
					i.value = categoryName + '_' + index;
					if (index == 0){
						i.checked = true;
					}
					l = document.createElement('label');
					l.appendChild(i);
					l.appendChild(img);

					prior.appendChild(l);
					index = index + 1;
				});
			});
		});

	};



//fetch images for scene canvas
var fetchSceneImages = function(btn, cv, fsi){
	let formData = new FormData();

	for (let i=0; i < cv.children.length; i++){

		let img_temp = cv.children[i].toDataURL();
		formData.append(String(i) , img_temp);
	}


	let csrftoken = Cookies.get('csrftoken');
	// formData.append('csrfmiddlewaretoken', $('#csrf-helper input[name="csrfmiddlewaretoken"]').attr('value'));

	let headers = new Headers();
	headers.append('X-CSRFToken', csrftoken);

	serverURL = '/fetchSceneImages/'
	
	btn.value = "fetching...";
	btn.disabled = true;

	fetch(serverURL, {
		method: 'POST',
		body: formData,
		headers: headers 
	
	}).then(function(response){
		btn.disabled = false;
		fsi.innerHTML = "";
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
					
					
					fsi.appendChild(l);
					
					btn.value = "Fetch scene";

				});
			});

		});

};




window.onload = layer3D