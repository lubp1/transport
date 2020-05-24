var createError = require('http-errors');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var logger = require('morgan');
var mongoOp = require('./models/mongo');  // modelo mongoOp
var mongoOpPassagem = require('./models/mongoPassagem');  // modelo mongoOpPassagem


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// serve static files
app.use('/', express.static(__dirname + '/'));


app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// adicione as duas linhas abaixo
var router = express.Router();
app.use('/', router);   // deve vir depois de app.use(bodyParser...



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

// alguns navegadores enviam uma requisicao OPTIONS antes de POST e PUT
router.route('/*') 
 .options(function(req, res) {  // OPTIONS
   res.header('Access-Control-Allow-Origin', '*');
   res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE');
   res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Request-With');
   res.sendStatus(200);
   }
 );
 
 function checkAuth(req, res) {
  cookies = req.cookies;
  if(! cookies || ! cookies.userAuth) return 'unauthorized';
  cauth = cookies.userAuth;
  var content = JSON.parse(cauth);
  var key = content.key;
  var role = content.role;
  if(key == 'secret') return role
  return 'unauthorized';
}


 // index.html
router.route('/')
.get(function(req, res) {  // GET
  var path = 'telas/index.html';
  res.header('Cache-Control', 'no-cache');
  res.sendFile(path, {"root": "./"});
  }
);

  // tela inicial de um usuario especifico
router.route('/inicio')
 .get(function(req, res) {  // GET
    var path = 'telas/clienteHome.html';
    res.header('Cache-Control', 'no-cache');
    res.sendFile(path, {"root": "./"});
    }
  )
  .post(function(req, res) {  // POST
    console.log(JSON.stringify(req.body));
    var email = req.body.email;
    var senha = req.body.senha;
    var query = {"email": email, "senha": senha};
    // verifica usuario e senha na base de dados
    mongoOp.findOne(query, function(erro,data) {
      if(erro) {
        res.status(401).send('Falha de Autenticacao'); // Unauthorized
      } else if (data != null) {
        if (senha == data.senha && data.role == "user") {
          var content = {"key":"secret", "role":"user", "email": email};
          res.cookie('userAuth', JSON.stringify(content), {'maxAge': 3600000*24*5});
          res.status(200).send('Sucesso'); // OK
        }
        else if (senha == data.senha && data.role == "admin") {
          var content = {"key":"secret", "role":"admin", "email": email};
          res.cookie('userAuth', JSON.stringify(content), {'maxAge': 3600000*24*5});
          res.status(201).send('Sucesso'); // OK
        }
      } else {
        res.status(401).send('Falha de Autenticacao'); // Unauthorized
      }
    })
  });

  // tela de cadastro
router.route('/cadastro/')
.get(function(req, res) {  // GET
   var path = 'telas/cadastro.html';
   res.header('Cache-Control', 'no-cache');
   req.url = '/inicio';
   res.sendFile(path, {"root": "./"});
   }
 );


  // cadastrando um usuario especifico
router.route('/cadastro/:email') 
.post(function(req, res) {  // POST
  var nome = req.body.nome;
  var email = req.body.email;
  var cpf = req.body.cpf;
  var senha = req.body.senha;

  var query = {"email": email};
  mongoOp.findOne(query, function(erro, data) {
     if (data == null) {
        var db = new mongoOp();
        db.email = email;
        db.nome = nome;
        db.cpf = cpf;
        db.senha = senha;
        db.role = "user";
        db.save(function(erro) {
          if(erro) {
              res.status(400).send('Erro');
            } else {
              res.status(200).send('Sucesso');
            }
         }
       )
     } else if (data != null && data.senha == "") {
        mongoOp.findOneAndUpdate(query,{"senha": senha}, function(erro) {

          if(erro) {
            res.status(400).send('Erro');
          } else {
            res.status(201).send('Sucesso');
          }
        })
        } else {
          res.status(400).send('Erro');
        }
     }
   )
});

router.route('/passagemBalcao')
  .get(function(req, res) {  // GET
    if(checkAuth(req, res) != 'admin') {
      res.status(401).send('Unauthorized');
      return;
    }
    var path = 'telas/compraPassagem.html';
    res.header('Cache-Control', 'no-cache');
    res.sendFile(path, {"root": "./"});
    }
  )
  .post(function(req, res) {  // POST
    var cpf = req.body.cpf;

    if (cpf != "") {
      mongoOp.findOne({"cpf": cpf}, function(erro, data) {
        res.json({"usuario": data});
       }
      )
    } else {
      var partida = req.body.partida;
      var destino = req.body.destino;
      var horario = req.body.horario;
      var assento = req.body.assento;
      var query = {"partida": partida, "destino": destino};
      if(horario != "") {
        query.horario = horario;
      } else {
        query.assento = assento;
      }
      mongoOpPassagem.find(query, function(erro, data) {
        if (erro) {
            res.status(400).send('Erro');
        } else if (data != null) {
            res.json({"viagem": data});
            res.status(200);
        } else {
          res.status(400).send('Erro');
        }
        }
      )
      }
    });

  router.route('/passagemBalcao/:cpf') 
    .post(function(req, res) {  // POST
      var partida = req.body.partida;
      var destino = req.body.destino;
      var horario = req.body.horario;
      var assento = req.body.assento;
      var cpf = req.body.cpf;


      var db = new mongoOpPassagem();
      db.partida = partida;
      db.destino = destino;
      db.horario = horario;
      db.assento = assento;
      db.cpf = cpf;
      db.save(function(erro) {
        if(erro) {
            res.status(400).send('Erro');
          } else {
            res.status(200).send('Sucesso');
          }
      }
      )
    });
