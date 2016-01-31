var node_xj = require("xls-to-json");

node_xj({
        input: "./uploads/input.xls",  
        output: "./uploads/output.json"   
    }, function(err, result) {
        if(err) {
          console.error(err);
        } else {
          console.log(result);
        }
    });