(async () => {
    const { application } = require('express')
    const express = require('express')
    const app = express()
    const db = require("./db.js")
    const url = require("url")
    const bodyParser = require("body-parser")
    const session = require("express-session")
    const port = 8080

    // config para as variáveis post
    app.use(bodyParser.urlencoded({extended:false})) // Não faz a extensão para outras ramificações
    app.use(bodyParser.json())

    const dia = 1000 * 60 * 60 * 24;
    const min15 = 1000 * 60 * 60 / 4;

    app.use(session({
        secret: "hrgfgrfrty84fwir767",
        saveUninitialized:true,
        cookie: { maxAge: dia},
        resave: false 
    }))

    app.set("view engine", "ejs")
    app.use(express.static('livraria-2022'))
    app.use("/js",express.static("js"))
    app.use("/css",express.static("css"))
    app.use("/books",express.static("books"))
    app.use("/imgs",express.static("imgs"))

    const consulta = await db.selectFilmes()
    //console.log(consulta[0].titulo)
    const consultaLivro = await db.selectLivros()
    //console.log(consultaLivro[0].titulo)
    const consultaCarrinho = await db.selectCarrinhos()
    //console.log(consultaCarrinho[0].titulo)

    app.get("/login",(req, res) => {
        res.render('login',{
            titulo:'Entrar - Livros Online'
        })
    })

    app.post("/login", async(req,res) => {
        let info = req.body
        let consultaUsers = await db.selectUsers(info.email, info.senha)
        consultaUsers == "" ? res.send("Usuário não encontrado") : res.redirect("/")
        const s = req.session
        consultaUsers != "" ? s.nome = info.nome : null
    })

    app.get("/",(req, res) => { // Chama a página principal e traz as consultas através das variáveis
        res.render(`index`,{
            titulo:"Conheça nossos livros",
            promo:"- Compre com 10% de desconto!",
            livro:consulta,
            galeria:consultaLivro
        })
    })

    app.get("/upd-promo",(req, res) => { // Chama a página principal e traz as consultas através das variáveis
        res.render(`adm/atualiza-promocoes`,{
            titulo:"Conheça nossos livros",
            promo:"- Compre com 10% de desconto!",
            livro:consulta,
            inicio:consultaLivro
        })
    })

    app.get("/insere-livro",async(req,res) => { // Chama a página insere-livros e insere um registro no banco de dados
        await db.insertLivro({resumo:"Lorem Guerra dos Mundos Lorem", imagem:"guerra-dos-mundos.jpg", valor:"80.14", titulo:"A Guerra dos Mundos"})
        res.send("<h3>Livro Adicionado!</h3><a href='./'>Voltar</a>")
    })

    app.get("/atualiza-promo",async(req,res) => { // Chama a página e altera o campo promo de um livro_id
        //let infoUrl = req.url
        //let urlProp = url.parse(infoUrl,true)
        //let q = urlProp.query
        let qs = url.parse(req.url,true).query
        await db.updatePromo(qs.promo,qs.id) // localhost:8080/atualiza-promo?promo=1&id=9  (No banco, o livro_id=(9), tem que estar com o campo promo=(0))
        res.send("<h3>Lista de Promoções Atualizada!</h3><a href='/promocoes'>Ver Promoções</a>")
    })

    app.get("/promocoes",async(req, res) => { // Chama a página promocoes e mostra os itens específicos
        const consultaPromo = await db.selectPromo()
        res.render(`promocoes`,{
            titulo:"Conheça nossos livros",
            promo:"- Compre com 10% de desconto!",
            livro:consulta,
            galeria:consultaPromo
        })
    })

    app.get("/contato",(req, res) => {
        res.render(`contato`,{
            titulo:"Conheça nossos livros",
            promo:"- Compre com 10% de desconto!",
            //inicio:consultaLivro
        })
    })

    app.post("/contato", async(req,res) => { // Recupera a informação do formulário e mostra na tela em formato json.
        const info=req.body
        await db.insertContato({
            nome:info.cad_nome,
            sobrenome:info.cad_sobrenome,
            email:info.cad_email,
            mensagem:info.cad_mensagem
        })
        //res.send(info),
        //res.send(info.cad_email)
        //res.send("Contato Cadastrado!")
        res.render(`contato`,{
            titulo:"Conheça nossos livros",
            promo:"- Compre com 10% de desconto!"
        })
    })

    app.get("/carrinho",async(req, res) => {
        const consultaCarrinhos = await db.selectCarrinhos()
        res.render(`carrinho`,{
            titulo:"Conheça nossos livros",
            promo:"- Compre com 10% de desconto!",
            carrinhos:consultaCarrinhos
        })
    })

    app.post("/carrinho-p", async(req,res) => { // Informações vindas do jquery post
        let info = req.body
        await db.insertCarrinho({
            produto:info.produto,
            qtd:info.qtd,
            valor:info.valor,
            livros_id:info.livros_id
        })
        res.send(req.body) 
    })

    app.post("/delete-carrinho", async(req,res) => { // Informações vindas do jquery post
        let info = req.body
        await db.deleteCarrinho(info.id)
        res.send(info) 
    })

    app.get("/single-produto",async(req, res) => { // Chamada da página através das páginas Index, Promoções, quando clicado em qualquer produto.
        let infoUrl = req.url
        let urlProp = url.parse(infoUrl,true)
        let q = urlProp.query
        const consultaSingle = await db.selectSingle(q.id)
        const consultaInit = await db.selectSingle(4)
        res.render(`single-produto`,{
            titulo:"Conheça nossos livros",
            promo:"- Compre com 10% de desconto!",
            livro:consulta,
            galeria:consultaSingle,
            inicio:consultaInit
        })
    })

    app.get("/cadastro",(req, res) => {
        res.render(`cadastro`,{
            titulo:"Conheça nossos livros",
            promo:"- Compre com 10% de desconto!",
            livro:consulta
        })
    })

    app.post("/cadastro",async(req, res) => {
        const info=req.body
        await db.insertUsuario({
            nome:info.us_nome,
            email:info.us_email,
            telefone:info.us_telefone,
            senha:info.us_senha,
            conf_senha:info.us_conf_senha
        })
        res.render(`cadastro`,{
            titulo:"Conheça nossos livros",
            promo:"- Compre com 10% de desconto!"
        })
    })

    app.listen(port, () => console.log(`Servidor rodando com nodemon na porta ${port} - ${__dirname}`))
})()