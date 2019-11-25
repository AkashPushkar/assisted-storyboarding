var width1, width2;
var padding;

var init = function(){
	padding = 15;
	width1 = document.getElementsByClassName("canvas1-size")[0].clientWidth;
	width2 = document.getElementsByClassName("canvas2-size")[0].clientWidth;
	resize();
}



var resize = function(){

	var imageR = new Image();

	if (width1  > window.innerWidth - 2*padding){
		var div_cs1 = document.querySelectorAll(".canvas1-size")[0];

		var w = (Number(document.getElementsByClassName("container")[0].clientWidth) - 2*padding).toString();
		div_cs1.setAttribute('style','width:'+ w + 'px; height:'+ w + 'px;');

		var cs1 = document.querySelectorAll(".canvas1-size > canvas");
		for (var i=0; i<cs1.length; i++){
			img_temp = cs1[i].toDataURL();
			cs1[i].width = w;
			cs1[i].height = cs1[i].width;
			imageR.src = img_temp;
			cs1[i].getContext("2d").drawImage(imageR, 0,0, cs1[i].width, cs1[i].height);
		}

	}

	if (width2  > window.innerWidth - 2*padding){
		var div_cs2 = document.querySelectorAll(".canvas2-size")[0];

		var w = (Number(document.getElementsByClassName("container")[0].clientWidth) - 2*padding).toString();
		div_cs2.setAttribute('style','width:'+ w + 'px; height:'+ w/1.6 + 'px;');

		var cs2 = document.querySelectorAll(".canvas2-size > canvas");
		for (var i=0; i<cs2.length; i++){
			img_temp = cs2[i].toDataURL();
			cs2[i].width = w;
			cs2[i].height = cs2[i].width / 1.6;
			imageR.src = img_temp;
			cs2[i].getContext("2d").drawImage(imageR, 0,0, cs2[i].width, cs2[i].height);
		}
	}
};

window.onload = init;