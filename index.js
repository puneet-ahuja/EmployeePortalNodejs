//loading express into project
var express = require('express')

//loading body parser to the project
var bp = require('body-parser')


var sql = require('mssql');

//storing express as a variable
var app = express();


//config object for database
var config = {
	    user: 'sa',
	    password: 'Passw0rd',
	    server: 'localhost',
	    port:1234, 
	    database: 'EmployeePortal'
	};


//array of notices to global area
global.notices = [
	{
		id: 1 ,
		title : 'notice 1',
		desc: 'I am first Notice'
	},
	{
		id: 2 ,
		title : 'notice 2',
		desc: 'I am second Notice'

	},
	{
		id: 3 ,
		title : 'notice 3',
		desc: 'I am third Notice'

	}]

//static is used to make all the files requestable in a particular folder
//here public folder
app.use(express.static('public'));


app.use(bp.urlencoded({
	extended:true
}))


app.use(bp.json());


// respond with "hello world" when a GET request is made to the homepage
app.get('/test', function (req, res) {
  res.send('hello world')
});


//get request for /notices
app.get('/notices', function (req, res) {
  res.send(global.notices);
  console.log("get Request Successful");
});

//delete request for / notices
app.delete('/notices' , function(req , res){
	//variable declarartion
	var noticeId = parseInt( req.body.id , 10 );
	var index;
	var searchIndex;

	//search index of target element
	for(index = 0 ; index < global.notices.length ; index++){

		if(noticeId == global.notices[index].id){
			searchIndex = index;
		}
	}

	//remove target element form global notices
	var removedElement = global.notices.splice( searchIndex , 1 );

	res.send(removedElement);

});

//update request for /notices
app.put('/notices' , function(req,res){
	//variable declarartion
	var noticeId = parseInt( req.body.id , 10 );
	var index;
	var searchIndex;
	console.log("Notice id is " + noticeId);

	debugger;

	//search index of target element
	for(index = 0 ; index < global.notices.length ; index++){

		if(noticeId === global.notices[index].id){
			searchIndex = index;
			break;
		}
	}

	//update target object in array
	global.notices[searchIndex].id = noticeId;
	global.notices[searchIndex].title = req.body.title;
	global.notices[searchIndex].desc = req.body.desc;

	console.log("Element updated");
	res.send(global.notices[searchIndex]);


});

app.post('/notices' , function(req , res){
	var notice = {};
	notice.id = global.notices[global.notices.length - 1].id + 1;
	notice.title = req.body.title;
	notice.desc = req.body.desc;

	global.notices.push(notice);
	console.log("Elemented Added Successfully");
	res.send(global.notices);
});


app.get('/notices-sql' , function(req , res){
	sql.connect(config).then(function(){
		console.log('connected');
			var sqlReqst = new sql.Request();
		    
		    sqlReqst.query('SELECT * FROM [Notices];').then(function(recordsets) {
		        var notices = recordsets.recordset;
		        var toSendNotices = notices.map(function(notice, idx){
		        	return {
		        		id: notice.NoticeId,
		        		title: notice.Title,
		        		desc: notice.Description
		        	};
		        	
		        });

		        sql.close();
		        res.send(toSendNotices);
		    }).catch(function(err) {
		    	console.log(err);
		    });
		}).catch(function(err) {
		    console.log(err);
		});
});

//started server at port number 3000
app.listen(3000 , function(){
	console.log('EXample app listening on port 3000!');
});