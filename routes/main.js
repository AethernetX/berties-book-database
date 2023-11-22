module.exports = function(app, shopData) {

    // Handle our routes
    app.get('/',function(req,res){
        res.render('index.ejs', shopData)
    });
    //about
    app.get('/about',function(req,res){
        res.render('about.ejs', shopData);
    });
    //search
    app.get('/search',function(req,res){
        res.render("search.ejs", shopData);
    });
    //search results after putting search
    app.get('/search-result', function (req, res) {
        //searching in the database
        let sqlquery;
        //checks which search method they want
        if(req.query.searchTypes == "advanced"){
            sqlquery = " SELECT * FROM books WHERE name LIKE '%" + req.query.keyword +"%'"; //query database to get all the books containing keyword
        }
        if(req.query.searchTypes == "basic"){
            sqlquery = "SELECT * FROM books WHERE name LIKE '" + req.query.keyword + "'";  //query database to get all books with exact name          
        }

        // execute sql query
        db.query(sqlquery, (err, result) => {
            if(err){
                res.redirect("./");
            }
           let newData = Object.assign({}, shopData, {availableBooks:result});
           console.log(newData);
           res.render("search-result", newData);
        }); 
    });
    //register
    app.get('/register', function (req,res) {
        res.render('register.ejs', shopData);                                                                     
    });       
    //registered                                                                                          
    app.post('/registered', function (req,res) {
        // saving data in database
        res.send(' Hello '+ req.body.first + ' '+ req.body.last +' you are now registered!  We will send an email to you at ' + req.body.email);                                                                              
    }); 
    //list
    app.get("/list", function(req, res){
        let sqlquery = "SELECT * FROM books"; //query database to get all the books
        // execute sql query
        db.query(sqlquery, (err, result) => {
            if(err){
                res.redirect("./");
            }
           let newData = Object.assign({}, shopData, {availableBooks:result});
           //console.log(newData);
           res.render("list.ejs", newData); 
        });
    });
    //addbook
    app.get("/addbook", function(req,res){
        res.render("addbook.ejs", shopData);
    });
    //takes you to this page when you add a book
    app.post('/bookadded', function (req,res) {
           // saving data in database
           let sqlquery = "INSERT INTO books (name, price) VALUES (?,?)";
           // execute sql query
           let newrecord = [req.body.name, req.body.price];
           db.query(sqlquery, newrecord, (err, result) => {
             if (err) {
               return console.error(err.message);
             }
             else {
               res.send(' This book is added to database, name: '
                         + req.body.name + ' price '+ req.body.price);
             }
           });
     });    
    //returns every book under £20
    app.get("/bargainbooks", function(req, res){
        let sqlquery = "select name, price from books where price <= 20"; //query database to get all the books
        // execute sql query
        db.query(sqlquery, (err, result) => {
            if(err){
                res.redirect("./");
            }
           let newData = Object.assign({}, shopData, {availableBooks:result});
           console.log(newData);
           res.render("bargainbooks.ejs", newData); 
        });
    });
 

}
