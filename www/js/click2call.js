'use strict';

var verto;
var cur_call;
var online_visible=false;
var call2Number = null;

var callbacks = {

    onMessage: function(verto, dialog, msg, data) {
    	
    	console.log("***** onMessage ****"); 
 
        switch (msg) {
	        case $.verto.enum.message.pvtEvent:
	            break;
	        case $.verto.enum.message.info:
	            break;
	        case $.verto.enum.message.display:
	            break;
	        default:
	            break;
	        }
    },

    onDialogState: function(d) {
    	
    	console.log("***** onDialogState ****"); 
      	console.dir(d.state);
    	
        cur_call = d;
	
        switch (d.state) {
	        case $.verto.enum.state.ringing:
	            display("Call From: " + d.cidString());	
	            break;
	        case $.verto.enum.state.trying:
	        case $.verto.enum.state.early:
	        	display("Llamando");
	            displayCalling();
	        	break;
	        case $.verto.enum.state.active:
	            display("Hablando");
	            break;
	        case $.verto.enum.state.hangup:        	
	        	display("");
		    case $.verto.enum.state.destroy:
	            cur_call = null;
		        displayReady2Call();
	            break;
	        case $.verto.enum.state.held:
	            break;
	        default:
	            display("");
	            break;
        }
    },
    
    onWSLogin: function(v, success) {
    	console.log("***** onWSLogin ****"); 
    	
		cur_call = null;
		online(success);

    },
    
    onWSClose: function(v, success) {
    	console.log("***** onWSClose ****"); 

    	online(false);
    },

    onEvent: function(v, e) {
        console.debug("GOT EVENT", e);
    },
};

function online(b){
	online_visible=b;
	if(online_visible) {
		display("Listo para hacer llamadas");
		displayReady2Call();
	} else {
		display("No se puedo conectar al servidor. Intentando nuevamente. Aguarde ...");
		displayNoConnection();
	}
}


function docall() {

    cur_call = verto.newCall({
        destination_number: call2Number,
        caller_id_name: "Web Anura",
        caller_id_number: "1111",
        useVideo: false,
        useStereo:false
    });
}

function display(l) {
	console.log(l);
	if( $("#click2call_msgdiv").length ) { 
		$("#click2call_msgdiv").html(l);
	}
}

function displayCalling() {
	$("#click2call_callbtn").hide();
	$("#click2call_hupbtn").show();
}

function displayReady2Call() {
	$("#click2call_callbtn").show();
	$("#click2call_hupbtn").hide();
}

function displayNoConnection() {
	$("#click2call_callbtn").hide();
	$("#click2call_hupbtn").hide();
}

function init() {
	
	console.log("**** init **** ");
	
	displayNoConnection();
	
	if(!isWebRTCSupported()) {
		$("#click2call").hide();
		console.log("El browser no soporta WebRTC");
		return;
	}

    var strUser = $('#click2call_user').val();
    var strDomain = $('#click2call_domain').val();
    var strPassword = $('#click2call_password').val();
    call2Number = $('#click2call_number').val();
    if(strUser == null || strDomain == null || strPassword == null || call2Number == null) {
    	alert("Debe configuarar Usuario,Password,Dominio y numero de destino");
    	return;
    }
    
    verto = new $.verto({
        login: strUser+"@"+strDomain,
        passwd: strPassword,
        socketUrl: "ws://webrtc.grancentral.com.ar:9081",
        tag: "webcam",
        iceServers: false // stun
    },callbacks);
    
    
    $("#click2call_callbtn").click(function() {
	console.log("click click2call_callbtn");
        docall();
        return false;
    });
    
    $("#click2call_hupbtn").click(function() {
    	if(cur_call != null) {
	        verto.hangup();
	        cur_call = null;
    	}
    	return false;
    });

}

function isWebRTCSupported() {
	return true;
}
