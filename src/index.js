const http = require('http');
const path = require('path');
const exphbs = require('express-handlebars');
const session = require('express-session');
const MySQLStore = require('express-mysql-session');
const {database} = require('./keys');
const passport = require('passport');
const express = require('express');
const flash = require('connect-flash');
var url = require('url');


const serveIndex = require('serve-index');
new URL('/public/diagnosticos', 'file:');
//pathToFileURL('/foo#1');

//Initializations
const app = express();
require('./lib/passport');



app.use(express.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'css')));
app.use(express.static(path.join(__dirname, '/public')));
let ruta1 = path.join(__dirname, 'views/pages');
console.log('Esta es la ruta 1: ' + ruta1);
//app.use(express.static(path.join(__dirname, 'views/pages')));
app.use('pages', express.static(path.join(__dirname, 'views/pages')));
//app.use('/', express.static(path.join(__dirname +  '/')));
//app.use(passport.session());
//app.use(passport.initialize());
app.set('views', path.join(__dirname, 'views'));

/*
app.use('/*', function(req, res){
  console.log('se pide app use en index js')
  res.sendFile(__dirname + '/index.html');
});
*/


app.use(
  '/ftp',
  express.static('/public'),
  serveIndex('/public', {icons: true})
)


/* nuevo código */
app.use((req, res, next) => {
  app.locals.user = req.user;
  next(); 
});
/**/


/*Middlewares */
app.use(session({
  secret: 'FrankSession',
  resave: false,
  saveUninitialized: false,
  store: MySQLStore(database)
}));
app.use(passport.initialize());
app.use(passport.session())
app.use(flash());

/*
app.engine('.hbs', exphbs({
  defaultLayout: 'main.hbs',
  layoutsDir: path.join(app.get('views'), 'layouts'),
  partialsDir: path.join(app.get('views'), 'partials'),
  extname: '.hbs',

  //helpers: require('./lib/handlebars')
  helpers: {'json': function(obj){
      return JSON.stringify(obj);
    }
  }
}));
//app.set('view engine', '.hbs');*/


app.use(require('./routes/RutasInicio.js')); 
app.use(require('./routes/RutasDashboard.js')); 
app.use(require('./routes/RutasTarjetas.js'));
app.use(require('./routes/RutasClientes.js'));
app.use(require('./routes/RutasEstaciones.js'));   
app.use(require('./routes/RutasTransacciones.js'));
 
app.set('port', process.env.PORT || 3000);

/*app.get('/', function(req, res) {
  console.log('Algo está pasando')
  const principal = path.join(__dirname, '/views/index.hbs');
  res.render(principal);
});*/

 



var server = http.createServer(app);
server.listen(app.get('port'), () =>{
  console.log('Server on port ', app.get('port'));
});

require('./sockets.js')(server);