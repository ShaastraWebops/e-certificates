    var express = require('express'); 
    var app = express(); 
    var bodyParser = require('body-parser');
    var multer = require('multer');
    var http = require('http');
    var sys = require('sys');
    var exec = require('child_process').exec;
    var util = require('util');
    var fs = require('fs');
    var api_key = '';
    var sendgrid = require('sendgrid')(api_key);
    var nodemailer = require('nodemailer');
    var sleep = require('sleep');

    var contents = fs.readFileSync("./uploads/output.json");
    var data = JSON.parse(contents);

    app.use(function(req, res, next) { //allow cross origin requests
        res.setHeader("Access-Control-Allow-Methods", "POST, PUT, OPTIONS, DELETE, GET");
        res.header("Access-Control-Allow-Origin", "http://localhost");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });

    /** Serving from the same express Server
    No cors required */
    app.use(express.static('../client'));
    app.use(bodyParser.json());  

    var storage = multer.diskStorage({ //multers disk storage settings
        destination: function (req, file, cb) {
            cb(null, _dirname + '/uploads/');
        },
        filename: function (req, file, cb) {
            var datetimestamp = Date.now();
            cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1]);
        }
    });

    var upload = multer({ //multer settings
                    storage: storage
                }).single('file');

    /** API path that will upload the files */
    app.post('/upload', function(req, res) {
        upload(req,res,function(err){
            if(err){
                 res.json({error_code:1,err_desc:err});
                 return;
            }
             res.json({error_code:0,err_desc:null});
        });
    });


    function sendEmail(i){
        // Convert HTML to PDF with wkhtmltopdf
        console.log("Come" + i);
        var modifiedFirstName = data[i].name.replace(/[^a-zA-Z0-9]/g, '');
        var destinationEmail = data[i].email;
        var text_body = "PFA your e-certificate";  
        fs.readFile('pdfs/'+ modifiedFirstName +'.pdf',function(err,data){
                console.log(destinationEmail);
                var params = {
                    to: destinationEmail,
                    from: 'support@shaastra.org',
                    fromname: 'Shaastra WebOps',
                    subject: 'Welcome to Shaastra 2016',
                    text: text_body,
                    files: [{filename: 'e-certificate.pdf', content: data}]
                };
                var email = new sendgrid.Email(params);
                sendgrid.send(email, function (err, json) {
                    console.log('Error sending mail - ', err);
                    console.log('Success sending mail - ', json);
                });
            });

    }


    function pdfConvert(i){
        console.log(i);
        var dummyContent = '<!DOCTYPE html><html><head><title></title></head><body><img style="width:100%" src="../uploads/pr.jpg"><h3 style="position:absolute;top:42.5%;left:35%">' + data[i].name + " " + data[i].lastName +'</h3><h3 style="position:absolute;top:47%;left:32%">' + data[i].college + '</h3></body></html>';
        // var dummyContent = '<!DOCTYPE html><html><head><title></title></head><body><img style="width:100%" src="../uploads/winnerscertificate.jpg"><h3 style="position:absolute;top:42.5%;left:35%">Howard</h3><h3 style="position:absolute;top:47%;left:32%">IIT Madras</h3></body></html>';
        var modifiedFirstName = data[i].name.replace(/[^a-zA-Z0-9]/g, '');
        var htmlFileName = "htmls/"+ modifiedFirstName +".html", pdfFileName = "pdfs/"+ modifiedFirstName +".pdf";
    
        // Save to HTML file
        fs.writeFile(htmlFileName, dummyContent, function(err) {
            console.log("Came" + i);
            if(err) { throw err; }
            util.log("file saved to site.html");

            var child = exec("wkhtmltopdf " + htmlFileName + " " + pdfFileName, function(err, stdout, stderr) {
                if(err) { throw err; }
                util.log(stderr);
                console.log("Came 2" + i);
                sendEmail(i);
            });
            
        });
    
        

        console.log('Rendered to ' + htmlFileName + ' and ' + pdfFileName + '\n');
    }

    for(var i=0; i<data.length; i++){
        pdfConvert(i);

    }
    

    app.listen('3000', function(){
        console.log('running on 3000...');
    });
