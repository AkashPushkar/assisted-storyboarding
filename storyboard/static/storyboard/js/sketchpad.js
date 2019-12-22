
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


let state3D = false





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




var disengage = function(e){
	e.preventDefault();
	paint = false;
	moving = false;
}



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
	
	temp.style.zIndex = (parseInt(temp.style.zIndex) + 1);
	temp.getContext("2d").lineJoin = 'round';
	temp.getContext("2d").lineCap = 'round';

	cv.appendChild(temp);

	changeSCEventListener(value-1, value);
};


// remove layer
var removeLayer = function(list, cv){
	result = window.confirm("Do you really want to delete the layer? (This will delete the layer and reaarange the layer names)");
	if (result==true){
		if (list.value == list.lastElementChild.value){
			changeSCEventListener(list.lastElementChild.value-1, (list.lastElementChild.value-2));
		}
		
		cv.removeChild(cv.children[list.value-1]);
		list.removeChild(list.lastElementChild);
	}
}




// Add scene canvas to storyboard
var addScene = function(cv, lib){
	// var img_temp = new Image();
	// var temp_btn = document.createElement("button");

	// temp_btn.setAttribute("data-toggle","modal");
	// temp_btn.setAttribute("data-target","modal");
	
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
		// ctx.translate(e.clientX-rect.left-initial_X, e.clientY-rect.top-initial_Y);
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



// CSS 3d visualization of the scene canvas
var effect3D = function(btn, scene){
	if (state3D == true){
		btn.style.backgroundColor = "#2f3336";
		scene.style.border = "#2f3336"
		scene.style.perspective = '20em'
		for(var i=0; i<scene.children.length; i++){
			scene.children[i].style.transform = 'translateZ('+(i*(-50))+'px) rotateY(0deg)';
			scene.children[i].style.border = "0";
		}
	} else {
		btn.style.backgroundColor = ""
		for(var i=0; i<scene.children.length; i++){
			scene.children[i].style.transform = '';
			scene.children[i].style.border = "";
		}
	} 


};


// Scaling of layer
var scale = function(btn, ctx, change){
	// let temp_img = new Image()
	// let temp_img = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.width);
	// temp_img.src = ctx.canvas.toDataURL()
	// ctx.putImageData(temp_img, 0, 0, change*ctx.canvas.width , change*ctx.canvas.height);

	let cv = new OffscreenCanvas(ctx.canvas.width, ctx.canvas.height)
	cv = cv.getContext("2d")
	cv.drawImage(ctx.canvas, 0, 0)
	ctx.clearRect(0,0,ctx.canvas.width, ctx.canvas.width)
	ctx.drawImage(cv.canvas, 0, 0, change*ctx.canvas.width , change*ctx.canvas.height)

	// let c2s = new C2S(ctx.canvas.width, ctx.canvas.height); 
	// c2s.drawImage(ctx.canvas, 0, 0, ctx.canvas.width, ctx.canvas.height);
	// let data = c2s.getSerializedSvg(true)
	// let temp_img = new Image();
	// let data = c2s.getSerializedSvg(true);
	// temp_img.src = c2s.getSerializedSvg(true);

	// ctx.clearRect(0,0,ctx.canvas.width, ctx.canvas.width);
	// ctx.drawImage(temp_img, 0, 0, change*ctx.canvas.width , change*ctx.canvas.height);

	// ctx.scale(btn.value/10, btn.value/10)
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



// fetch images for scene canvas
var fetchSceneImages = function(cv, fsi){
	// let temp_cs = cv.firstElementChild.cloneNode();

	// temp_cs = temp_cs.getContext("2d");
	let img_temp = new Image();
	for (let i=0; i < cv.children.length; i++){

		let temp_cs = cv.firstElementChild.cloneNode();

		temp_cs = temp_cs.getContext("2d");
		
		let c_temp = cv.children[i];
		// let name = 'Layer' + i;
		// let lib_temp = document.getElementById("mb-sb");
		// saveCanvas(ctx_temp, name, lib_temp);

		temp_cs.drawImage(c_temp, 0, 0);	

		img_temp = temp_cs.canvas.toDataURL();

		let formData = new FormData();
		formData.append('image', img_temp);
		let csrftoken = Cookies.get('csrftoken');
		// formData.append('csrfmiddlewaretoken', $('#csrf-helper input[name="csrfmiddlewaretoken"]').attr('value'));

		let headers = new Headers();
		headers.append('X-CSRFToken', csrftoken);

		serverURL = '/fetchSceneImages/'

		fetch(serverURL, {
			method: 'POST',
			body: formData,
			headers: headers 
		});
	}

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

})();



