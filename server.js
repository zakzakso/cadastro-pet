//importa as bibliotecas padão
const express = require('express');
const cors = require('cors');
//para utilizar banco de dados
const mysql = require('mysql2/promise');

//para utilizar arquivos de impagens
const multer = require('multer');
const express = require('express');

//permite acessar as imagens salvas via url (ex: https://localhost:3000/upload/foto.jpg)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const db = mysql.createPool({
    host: 'localhost',
    user: 'admin',
    password: '1234',
    database: 'login',
    port: 3306,
});

//configuração do multer (onde salva a imagem e com qual nome)
const storege = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); //salva na pasta uploads
    },
    filename: (req, file, cb) => {
        //renomeia o arquivo para envitar nomes duplicados usando a data atual
        cb(null, Date.now( + path.extname(file.originalname)));
    }
});
const upload = multer({storege});

//função responsável por enviar os dados para o banco de dados
app.post('api/pets', upload.single('image'), async (req, res) => {
    const {tutor, nome_pet, raca, genero, peso, idade } = req.body;
    //if ternário
    const imagem_url = req.file ? `/uploads/${req.file.filename}` : null;

    //verifica se não tem dados nas variáveis que serão enviadas
    if(!tutor || !nome_pet || !raca || !genero || !peso || !idade || !imagem_url){
        return res.status(400).json({message: 'Todos os campos e a imagem são obrigatórios'});
    }

    //faz a tratativa de erro e envia os dados
    try {
        //organiza o insert dos dados e guarda na variável query
        const query = `
            INSERT INTO pets (tutor, nome_pet, raca, genero, peso, idade, imagem_url)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;

        //enviar os dados da query através do db que representa banco
        await db.query(query, [tutor, nome_pet, raca, genero, peso, idade, imagem_url]);

        //mensagem de sucesso
        return res.status(201).json({massage: 'Pet cadastro com sucesso!'});
    } catch (error) {
        console.error('Erro ao salvar pet:', error);
        return res.status(500).json({message: 'Erro ao salvar no banco de dados.'})

    }
});