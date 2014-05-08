var flag=false,current_date;
/*date function*/
var today = new Date();
var dd = today.getDate();
var mm = today.getMonth()+1; //January is 0!
var yyyy = today.getFullYear();
if(dd<10) {
    dd='0'+dd
} 
if(mm<10) {
    mm='0'+mm
} 
today = yyyy+'-'+mm+'-'+dd;
current_date=today;
/*End date function*/

/*DB creation*/
 window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
 
                if(!window.indexedDB)
                {
                    console.log("Your Browser does not support IndexedDB");
                }
 var request = window.indexedDB.open("tsl_diary", 3);
 var db;
                    request.onerror = function(event){
                        console.log("Error opening DB", event);
                    }
                    request.onupgradeneeded   = function(event){
                        console.log("Upgrading");
                        db = event.target.result;
                        var objectStore = db.createObjectStore("diary", { keyPath : "tstamp" });
                    };
                    request.onsuccess  = function(event){
                        console.log("Success opening DB");
                        db = event.target.result;
                    }


/*end DB creation*/


$(document).ready(function(){
	chklogin();
	 	$(function() {
		$( "#seldate" ).datepicker({ autoSize: true });
		});
	 $('#seldate').attr('value',today);
	 
 	 $("#seldate").change(function(){
		 	 flag=false;
		 	 current_date=$(this).val();
		     loaddata(current_date);
  	 	});
  	 $("#submit").click(function(){
  	 		inupdata();
  		 });
	 $("#overlay").click(function(){$("#overlay, #popup").hide();});  		 
  	 $("#change").click(function(){
  	 		if($("#rpw").val()==$("#crpw").val() && $("#cpw").val()!=null)
  	 		{
  	 			window.localStorage.setItem('tsl_pass',$("#rpw").val());
  	 			alert("Password successfully Changed!");
  	 			$("#overlay, #popup").hide();
  	 		}
  	 		else{alert("Oops, typo dude!!!");}
  		 });
});

function loaddata(data)
{
	dtaearr=data.split('-');
	checkif(dtaearr);
	if(!flag){$("#content").val('');}
}

function checkif(data)
{
	data=current_date.split('-');
  	tstamp=data.join("");
	var request = db.transaction(["diary"],"readwrite").objectStore("diary").get(tstamp);
                    request.onsuccess = function(event){
                        console.log(request.result); 
                        if(request.result){$("#content").val(request.result.d_content );flag=true;}
                    };
}

function inupdata()
{
  	 			data=current_date.split('-');
  	 			crid=data.join("");
  	 			txtval=$('#content').val();
  	 			if (!flag)
  	 			{
  	 				var transaction = db.transaction(["diary"],"readwrite");
                    transaction.oncomplete = function(event) {
                        console.log("Success-data added");
                    };
 
                    transaction.onerror = function(event) {
                        alert("Error");
                    };  
                    var objectStore = transaction.objectStore("diary");
                    objectStore.add({tstamp:crid , d_content: txtval});
  	 			}
  	 			else
  	 			{
  	 				var transaction = db.transaction(["diary"],"readwrite");
                    var objectStore = transaction.objectStore("diary");
                    var request = objectStore.get(crid);
                    request.onsuccess = function(event){
                        request.result.d_content = txtval;
                        objectStore.put(request.result);};
  	 			}
}

function chklogin()
{
	shout=window.localStorage.getItem('tsl_pass');
	if (!shout){$("#signup").show();}else{$("#login").show();}
}

function register()
{
	window.localStorage.setItem('tsl_favs','/');
	aka=$("#name").val();
	pw=$("#pass").val();
	cpw=$("#cpass").val();
	if (aka!="")
	{
		if (pw==cpw && pw!=""){
			window.localStorage.setItem('tsl_name',aka);
			window.localStorage.setItem('tsl_pass',pw);
			opendiary();
		}
		else
		{
			alert('Passwords do not match');
		}
	}
	else {alert('Please enter name');}
}
function letmein()
{
	if (window.localStorage.getItem('tsl_pass')==$('#pword').val())
	{
		opendiary();
	}
	else {alert("Kindly contact "+window.localStorage.getItem('tsl_name'));}
}
function opendiary()
{
	$('[data-role="page"]').hide();
	$('#diary, .foot').css({'display':'block'});
	setTimeout(function(){$('#diary').addClass('rotate');$('#diary').css('opacity','1')},1);
	loaddata(current_date);
}
function addfavs()
{
/*
	favdata=window.localStorage.getItem('tsl_favs');
	if ((favdata.indexOf(current_date))<0)
	{window.localStorage.setItem('tsl_favs',favdata+current_date+'/');}
*/
}
function loadfavs()
{
/*
	favdata=window.localStorage.getItem('tsl_favs');
	if (favdata!="/")
	{
		$('#favlist').html('');
		$('[data-role="page"]').hide();
		$('#favs').css({'display':'block'});
		favitems=favdata.split("/");
		console.log(favitems);
		for (i=1;i<(favitems.length-1);i++)
		{
			$('#favlist').append('<li>'+favitems[i]+'</li>');
		}
	}else {alert('No favs');}
*/
}
function resetpass()
{
	$("#overlay, #popup").show();
	
}
