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
var db = openDatabase('tsl', '1.0', 'Stores private data', 2 * 1024 * 1024);
db.transaction(function (tx) {
   tx.executeSql('CREATE TABLE IF NOT EXISTS tsl_diary (id INTEGER PRIMARY KEY ASC, d_date TEXT, d_month TEXT, d_year TEXT, d_content TEXT)');
});

/*end DB creation*/


$(document).ready(function(){
	chklogin();
	 $('#seldate').attr('value',today);
	 loaddata(current_date);
 	 $("#seldate").change(function(){
		 	 flag=false;
		 	 current_date=$(this).val();
		     loaddata(current_date);
  	 	});
  	 $("#submit").click(function(){
  	 		inupdata();
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
	db.transaction(function (tx) {
	   tx.executeSql('SELECT * FROM tsl_diary WHERE d_year=? AND d_month=? AND d_date=?', [data[0],data[1],data[2]], function (tx, results) {
	   var len = results.rows.length, i;
	   for (i = 0; i < len; i++){
	     $("#content").val(results.rows.item(i).d_content );
		flag=true;     
	   }
	 }, null);
});
}

function inupdata()
{
	db.transaction(function(tx) {
  	 			data=current_date.split('-');
  	 			crid=data.join("");
  	 			txtval=$('#content').val();
  	 			if (!flag){
  	 			tx.executeSql('INSERT INTO tsl_diary (id,d_date,d_month,d_year,d_content) VALUES(?,?,?,?,?)',[crid,data[2],data[1],data[0],txtval]);
  	 			}
  	 			else{
  	 			tx.executeSql('UPDATE tsl_diary SET d_content=? WHERE d_date=? AND d_month=? AND d_year=?',[txtval,data[2],data[1],data[0]]);
  	 			}
  	 		});
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
	$('#diary').css({'display':'block'});
	setTimeout(function(){$('#diary').addClass('rotate');$('#diary').css('opacity','1')},1);
}
function addfavs()
{
	favdata=window.localStorage.getItem('tsl_favs');
	if ((favdata.indexOf(current_date))<0)
	{window.localStorage.setItem('tsl_favs',favdata+current_date+'/');}
}
function loadfavs()
{
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
}
