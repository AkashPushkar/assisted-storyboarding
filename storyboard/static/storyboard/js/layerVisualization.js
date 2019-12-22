var unconstrainedSlider = document.getElementById('layers');
var unconstrainedValues = document.getElementById('unconstrained-values');


options = {
	start: [1],
    behaviour: 'unconstrained-tap',
    // connect: true,
    step: 1,
    range: {
        'min': 0,
        'max': 20
    }
};


noUiSlider.create(unconstrainedSlider, options);


var layer3D = function(e){
	unconstrainedSlider.noUiSlider.destroy();
	options.start = [...Array(sc.childElementCount).keys()]
	options.range['max'] = sc.childElementCount + 2;
	noUiSlider.create(unconstrainedSlider, options);

	let handles = document.getElementsByClassName('noUi-handle');


	for (let i=0; i<sc.children.length; i++){

		let w = sc.children[i].width/4;
		let h = sc.children[i].height/4;
		let cv_temp = document.createElement('canvas');
		cv_temp.width = w;
		cv_temp.height = h;

		cv_temp.getContext("2d").drawImage(sc.children[i], 0,0, w, h);
		let url = cv_temp.toDataURL("image/jpg");

		// let url = sc.children[i].toDataURL("image/jpg");	

		handles[i].style.backgroundImage = 'url('+url+')';
		handles[i].style.width = w + 'px';
		handles[i].style.height = h +'px';
		handles[i].style.opacity = '0.8';

		handles[i].style.transform = 'skew(0deg, 20deg)';
	}

	unconstrainedSlider.noUiSlider.on('update', function (values) {
    unconstrainedValues.innerHTML = values.join(' :: ');
	});
};


var effect3D_right = function(scene, delta){
	if (state3D == true){
		for(var i=0; i<scene.children.length; i++){
			rotateValue = parseInt(sc.children[i].style.getPropertyValue("transform").split("rotateY(")[1].split("deg)")[0]) + delta;
			translateValue = parseInt(sc.children[i].style.getPropertyValue("transform").split("translateZ(")[1].split("px)")[0]);

			scene.children[i].style.transform = 'translateZ('+translateValue+'px) rotateY('+ rotateValue + 'deg)';
			// scene.children[i].style.border = "0";
		}
	}
} 




