async function conecta(){
    const mysql = require("mysql2/promise")
    const conn = await mysql.createConnection({
        host:"localhost",
        user:"nfukumoto",
        password:"24052003nN@!",
        database: "filmes"
    })
    console.log("mySQL conectado!")
    global.connection = conn
    return connection
}

//conecta()

async function selectFilmes(){
    const conectado = await conecta()
    const [rows] = await conectado.query("select v.titulo, v.genero, d.nome from videos as v inner join diretores as d on d.diretor_id = v.diretor order by v.titulo asc")
    //console.log(rows)
    return rows
}

async function selectLivros(){ // Consulta todos os registros da tabela livros e mostra em ordem decrescente
    const conectado = await conecta()
    const [rows] = await conectado.query("select * from livros order by livros_id desc")
    //console.log(rows)
    return rows
}

async function selectSingle(id){ // Consulta todos os registros da tabela livros e mostra 1 específico através do campo livro_id
    const conectado = await conecta()
    const values = [id]
    const [rows] = await conectado.query("select * from livros where livros_id=?",values)
    //console.log(rows)
    return rows
}

async function selectPromo(){ // Consulta registros com a coluna promo = 1
    const conectado = await conecta()
    const [rows] = await conectado.query("select * from livros where promo=1")
    //console.log(rows)
    return rows
}

async function selectUsers(email, senha){ // Consulta registros com a coluna promo = 1
    const conectado = await conecta()
    const values = [email, senha]
    const [rows] = await conectado.query("select * from usuarios where email=? and senha=?", values)
    //console.log(rows)
    return rows
}

async function updatePromo(promo, id){ // Altera a coluna promo para 0 ou 1 através da coluna livros_id
    const conectado = await conecta()
    const values = [promo, id]
    return await conectado.query("update livros set promo=? where livros_id=?",values)
}

updatePromo(1,3)

async function selectCarrinhos(){ // Seleciona os registros da tabela carrinho
    const conectado = await conecta()
    const [rows] = await conectado.query("select * from carrinho order by carrinho_id asc")
    //console.log(rows)
    return rows
}

async function insertLivro(livro){ // Insere registro na tabela de forma manual
    const conectado = await conecta()
    const values = [livro.resumo,livro.imagem,livro.valor,livro.titulo]
    const [rows] = await conectado.query("insert into livros(resumo, imagem, valor, titulo) values(?,?,?,?)",values)
    //console.log("Insert OK!")
    return rows
}
//insertLivro({resumo:"Lorem Lorem", imagem:"wild-fury.jpg", valor:"40.35", titulo:"Wild Fury"})

async function insertContato(contato){ // Insere registro na tabela de forma manual
    const conectado = await conecta()
    const values = [contato.nome,contato.sobrenome,contato.email,contato.mensagem]
    const [rows] = await conectado.query("insert into contato(nome, sobrenome, email, mensagem) values(?,?,?,?)",values)
    //console.log("Insert OK!")
    return rows
}
//insertContato({nome:"Albert",sobrenome:"Einstein",email:"einstein@gmail.com",mensagem:"Teoria da Relatividade"})
//insertContato({nome:"Michael",sobrenome:"Jackson",email:"jackson@gmail.com",mensagem:"Moonwalker"})

async function insertUsuario(usuario){ // Insere registro na tabela de forma manual
    const conectado = await conecta()
    const values = [usuario.nome,usuario.email,usuario.telefone,usuario.senha,usuario.conf_senha]
    const [rows] = await conectado.query("insert into usuarios(nome, email, telefone, senha, conf_senha) values(?,?,?,?,?)",values)
    //console.log("Insert OK!")
    return rows
}

async function insertCarrinho(carrinho){ // Insere registro na tabela de forma manual
    const conectado = await conecta()
    const values = [carrinho.produto,carrinho.qtd,carrinho.valor,carrinho.livros_id]
    const [rows] = await conectado.query("insert into carrinho(produto, qtd, valor, livros_id) values(?,?,?,?)",values)
    //console.log("Insert OK!")
    return rows
}

async function deleteCarrinho(id){ // Exclui o registro através da coluna livros_id
    const conectado = await conecta()
    const values = [id]
    return await conectado.query("delete from carrinho where carrinho_id=?",values)
}

//selectFilmes()
//selectLivros()
//selectCarrinhos()
//selectSingle(10)

module.exports = {
    selectFilmes,
    selectLivros,
    selectCarrinhos,
    selectSingle,
    selectPromo,
    selectUsers,
    insertLivro,
    insertContato,
    insertUsuario,
    insertCarrinho,
    updatePromo,
    deleteCarrinho
}
