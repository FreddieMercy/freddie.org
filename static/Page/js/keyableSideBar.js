/*
 * _mark() //after selected <li a >
 * 
 * _selectRight() //first time select
 * 		->selHelper()
 * 
 * _clicks() and _keys() //further select
 */ 

var file;
var navbar = "#sidebar1";
var thebody = "#Sections";
var root = "Home";
var thetitle="-Freddie's Personal Website";

var fadeInTime=500;
var fadeOtTime=500;

function restoreClickBehav(sel){
	$(sel).css({"background-color":"#2A2A2A","color":"#FFF"});
}

function performClickBehav(sel){
	$(sel).css({"color":"#000","background":"#FFF"});
}


function behav(){
	
	//restore the existing "#selected"
	var sel = document.getElementById("selected");
	sel.removeAttribute("id");
	restoreClickBehav(sel);
	
	//add "#selected" to the child whose: href == hash
		//If no hash, then: href == root
		//If hash does not exist: $("#selected") === root
	_selectRight();
	
	if(file != $("#selected").attr('alt'))
	{
		$(thebody).fadeOut(fadeOtTime, function(){
			/*document.getElementById("homeVideo").pause();*/
		
			_ajax($("#selected").attr('alt'));
			//console.log("alt: "+$("#selected").attr('alt'));
		});
		
		$(thebody).fadeIn(fadeInTime);
	}
}

function _ajax(_url){
	file=_url;
    $.ajax(
    		{
    			contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
    			ifModified:true,
    			async:false,
    		    //data : {'csrfmiddlewaretoken': '{{ csrf_token }}'},
    			url: _url,//window.location.hostname.concat(":8000/home/"),
    			type:"GET",
    			cache:false,
    			dataType:'html',
    			success: function(response){
    			
    				//console.log("success!");
    				//console.log(response);
    		
    				$(thebody).html(response);
    
    			},
    			
    			error:function(error){
    				alert(error.status);
    				//console.log(window.location.hostname.concat(":8000/home/")); 
    				//console.log("crsf: "+$("#crsf").text());},
    			
    			//beforeSend: function(xhr){xhr.setRequestHeader('X-CSRF-Token',$("#crsf").text())
    			},
    		}
    	);
}

function _mark(){
	
	if($("#selected").attr("alt")===file){
		return false;
	};
	
	window.location.hash = $("#selected").attr("href");
	
	//behav();
}

function _selectRight(){

	var pathArray = window.location.hash.split( '#' );
	var _location = pathArray[1];
	
	if(_location){
		_selHelper(_location);
	}
	else{
		_selHelper(root);
	}
	
	//for some reason: "document.getElementById("selected") === undefined" returns false
	
	if(document.getElementById("selected") == undefined)
	{
		_selHelper(root);
	}
};

function _selHelper(_locations){
	
	var _location = "#"+_locations;
	
	$(navbar+" nav ul li").each(function(){
		
		if($(this).children().attr("href") === _location)
		{
			//console.log($(this).children().text());
			if(document.getElementById("selected") === null){
				$(this).children().attr("id","selected");
			};

			$("title").text($("#selected").text()+thetitle);
			performClickBehav("#selected");
			
			return false;
			
		};

	});
	
	//_selHelper(root);
	
}

function _keys(){
		
	var sel;
	var timer;
	var kr = true;
	var kl = true;
	
	$(document).keydown(function(e){
		if((e.which === 37)||(e.which === 39))
		{
			sel = document.getElementById("selected");
			sel.removeAttribute("id");
			restoreClickBehav(sel);
			sel = $(sel).parent();
		
			switch(e.which) {
	 			   case 37:
							if(sel.prev().text().length > 0)
							{
									sel = sel.prev();
								
				
							}else{
									sel.parent().attr("id","selected");
									sel = $("#selected li").last();
									document.getElementById("selected").removeAttribute("id");								
							}
							clearTimeout(timer);
							kl = false;
						break;
	 			   case 39:
							if(sel.next().text().length > 0){
									
									sel = sel.next();
							}else{
					
									sel.parent().attr("id","selected");
									sel = $("#selected li").first();
									document.getElementById("selected").removeAttribute("id");
								
							};
							clearTimeout(timer);
							kr = false;
						break;
			};
	
			sel.children().attr("id","selected");
			performClickBehav("#selected");
		};
	}).keyup(function(ev){
		
		
	switch(ev.which) {
 			   case 37:
						kl = true;
        				break;
 			   case 39:

						kr = true;
        				break;
		};
	



		if(((ev.which === 37)||(ev.which === 39))&&(kr&&kl))
		{
			timer = setTimeout(function(){
				
				_mark();

			},fadeOtTime);
		};	
		
		});
};

function _clicks(){

	$("#sidebar1 nav ul li a").on("click",function(e){

		if($(this).attr("alt")===$("#selected").attr("alt")){
			return false;
		};
		
		restoreClickBehav("#selected");
		document.getElementById("selected").removeAttribute("id");
		$(this).attr("id","selected");
		_mark();
	});
};

function _hashChanged(){

	$(window).on('hashchange', function() {

		behav();
	});

	if(document.getElementById("selected") === null){
		behav();
	};


};

$(document).ready(function() {
	
	$(thebody).hide();

	$(navbar).headroom();
	
	_selectRight()
	
	//First time, _mark() without fadeout()
	_ajax($("#selected").attr('alt'));
	//console.log("alt: "+$("#selected").attr('alt'));
	$(thebody).fadeIn(fadeInTime+fadeOtTime);
	
	_keys();
	_clicks();
	
	_hashChanged();
	
	//Overall
	
	$("#sidebar1 nav a").hover(function(){
		
					$(this).css({"background-color":"#FFF","color":$("#sidebar1").css("background-color")});
    					
				             },function(){
								if($(this).attr("id") !== "selected")
								{
									$(this).css({"background-color":$("#sidebar1").css("background-color"),"color":"#FFF"});
								};
	});	
	
});