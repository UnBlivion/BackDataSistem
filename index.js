const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const expressMongoDb = require('express-mongo-db');

const app = express();

app.use(expressMongoDb('mongodb://localhost/emails'));
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('static'));

app.get('/emails', (req, res) => {
    req.db.collection('cadastros').find({}).toArray((erro, cadastros) => {
        res.send(cadastros);
    });
});

app.get('/email/:nome', (req, res) => {
    if(!req.params.nome){
        return res.status(400).send({mensagem: "Nome é obrigatório"});
    }
    req.db.collection('cadastros').findOne({nome: req.params.nome}, (erro, cadastro) => {
        if(erro){
            console.log(`erro:${erro}`)
        }
        if(cadastro){
            return res.send(cadastro);    
        }
        else{
            return res.send({});
        }
        });
});

app.post('/email/cadastrar', (req, res) => {
    if(!req.body.nome || !req.body.email){
        return res.status(400).send({mensagem: "Nome e email são obrigatórios"});
    }

    req.db.collection('cadastros').insert(req.body, erro => {
        if(erro){
            console.log(erro);
        }
        else{
            res.send({mensagem: 'Cadastro realizado com sucesso!'});
        }
    });
    
});

app.post('/email/atualizar', (req, res) => {
    if(!req.body.nome || !req.body.email){
        return res.status(400).send({mensagem: "Nome e email são obrigatórios"});
    }

    req.db.collection('cadastros').updateOne({nome: req.body.nome}, {$set: req.body}, erro => {
        if(erro){
            console.log(erro);
        }
        else{
            res.send({mensagem: 'Atualização realizada com sucesso!'});
        }
    });
});

app.delete('/email/:nome', (req, res) => {
    if(!req.params.nome){
        return res.status(400).send({mensagem: "Nome é obrigatório"});
    }
    req.db.collection('cadastros').deleteOne({nome: req.params.nome}, erro => {
        if(erro){
            console.log(erro);
        }
        else{
            return res.send({message: "Usuario removido com sucesso"});
        }
    });
});

app.listen(3000, () => console.log('Aplicação iniciada.'));