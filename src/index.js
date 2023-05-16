
const express = require('express')
const app = express();
app.use(express.json());

app.get('/', (request, response) => {
return response.json('OK');

});

const listaUsuario = []

app.post('/user', (request, response)=> {
    const dados = request.body

    if(!dados.email || !dados.email.includes('@') || !dados.email.includes('.com')){
        return response.status(400).json({
            sucesso: false,
            dados: null,
            msg: "É obrigatório email válido para cadastro"
        })

    }

    if(!dados.senha || dados.senha.length < 4){
        return response.status(400).json({
            sucesso: false,
            dados: null,
            msg: "É obrigatório senha para cadastro, com no mínimo 4 caracteres"
        })

    }

    if(!dados.nome.length){
        return response.status(400).json({
            sucesso: false,
            dados: null,
            msg: "É obrigatório nome válido para cadastro"
    })
    
    }

    const usuarioExistente = listaUsuario.find(usuario => usuario.email === dados.email)

    if (usuarioExistente) {
        return response.status(400).json({
            sucesso: false,
            dados: null,
            msg: "Já existe um usuário cadastrado com esse email"
        })
    }


    const novoUsuario = {
        id: new Date().getTime(),
        nome: dados.nome,
        email: dados.email,
        senha: dados.senha,
        logado: false
    }

    listaUsuario.push(novoUsuario)
    
    console.log(listaUsuario)
        return response.status(201).json({
            success: true,
            dados: novoUsuario,
            msg: "Usuário criado com sucesso"

        })
})


app.get('/users', (request, response) => {
    return response.status(200).json({
        sucesso: true,
        dados: listaUsuario,
        mensagem: 'Usuários encontrados'
    })
})

app.get('/user/:id', (request, response) => {

    const params = request.params

    const usuarioEncontrado = listaUsuario.find((user) =>user.id == params.id)

    if(!usuarioEncontrado){
        return response.status(404).json({
            sucesso:false,
            dado:null,
            mensagem: 'Usuario não encontrado'
        })
    }


    return response.status(200).json({
        sucesso:true,
        dado:usuarioEncontrado,
        mensagem: 'Usuario encontrado'
    })
})


app.post ('/login',(request, response) =>{
    const dadosUsuario = request.body

    const emailCorreto = listaUsuario.some((user) => user.email === dadosUsuario.email)
    const senhaCorreta = listaUsuario.some((user) => user.senha === dadosUsuario.senha)


    if(!emailCorreto || !senhaCorreta){
        return response.status(400).json({
            success: false,
            dados: {},
            msg: "Email ou senha incorretos"  
        })
    }

    listaUsuario.forEach(user => user.logado = false)

    const user = listaUsuario.find((user) => user.email == dadosUsuario.email && user.senha == dadosUsuario.senha)

    user.logado = true

    return response.status(200).json({
            success: true,
            dados: {},
            msg: "Login feito com sucesso!"  
    })
})

const listaRecados = []

app.post('/recados', (request,response) => {
    const dados = request.body
    
    const user = listaUsuario.find(user => user.logado ===  true)

    if(!user){
        return response.status(400).json({
            success: true,
            dados: {},
            msg: "É preciso estar logado para criar um recado!"  
        })
    }

    const novoRecado = {
        id : new Date().getTime(),
        titulo: dados.titulo,
        descricao: dados.descricao,
        autor: user
    }

    listaRecados.push(novoRecado)

    console.log(novoRecado)

    return response.status(201).json({
        success: true,
        dados: novoRecado,
        msg: "Recado criado com sucesso!"  
        
    })
})

app.get('/recados-encontrados/:id', (request, response) => {

    const params = request.params

    const recadoEncontrado = listaRecados.find((recado) =>recado.id == params.id)

    if(!recadoEncontrado){
        return response.status(404).json({
            sucesso:false,
            dado:null,
            mensagem: 'Recado não encontrado'
        })
    }


    return response.status(200).json({
        sucesso:true,
        dado:recadoEncontrado,
        mensagem: 'Recado encontrado'
    })
})

app.delete('/recados/:id',(request, response) => {
    const params = request.params
    const recados = listaRecados.find(recado => recado.id == params.id)

   

    if (!recados) {
        return response.status(400).json({
            success: false,
            msg: "Recado não encontrado"
        })
    }

    listaRecados.splice(recados, 1)

    console.log(listaRecados)

    return response.status(201).json({
        success: true,
        dados: {},
        msg: "Recado apagado com sucesso!" 
    })
})

app.put('/editar-recados/:id', (request, response) => {
    const params = request.params
    const recadoEncontrado = listaRecados.find(recado => recado.id == params.id)
    const recadoAtualizado = request.body

    if (!recadoEncontrado) {
        return response.status(400).json({
            success: false,
            msg: "Recado não encontrado"
        })
    }

    recadoEncontrado.titulo = recadoAtualizado.titulo
    recadoEncontrado.descricao = recadoAtualizado.descricao

    return response.status(200).json({
        success: true,
        dados: recadoAtualizado,
        msg: "Recado atualizado com sucesso!"
    })

})



app.listen(8080, () => console.log("Servidor iniciado"));



