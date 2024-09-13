const {select, input, checkbox} = require('@inquirer/prompts')

const fs = require("fs").promises

let metas = []

let mensage = "Bem Vindo ao App de Metas!"

async function Cadastrar(){
    const meta = await input({message: "Digite a meta: "})

    if(meta.length <= 3){
        console.log("A meta não pode ser menor que 3 caracteres!")
        return Cadastrar()
    }
    metas.push({
        value: meta, checked: false
    })
    mensage = "Meta cadastrada com sucesso!"
}

async function Listar() {
    const resposta = await checkbox({
        message: "Use as setas para mudar de meta, o espaço para marcar ou desmarcar e o Enter para finalizar",
        choices: [...metas],
        instructions: false
    })

    metas.forEach((m) => {
        m.checked = false
    })

    if(resposta.length == 0){
        mensage = "Nenhuma meta selecionada!"
        return
    }
    
    resposta.forEach((resposta) => {
        const meta = metas.find((m) => {
            return m.value == resposta
        })
        meta.checked = true
    })
    mensage = "Meta(s) finalizada(s)!"
}

async function MetasFeitas() {
    const feitas = metas.filter((meta) => {
        return meta.checked
    })
    if(feitas.length == 0){
        console.log("Não há metas realizadas!")
        return
    }
    await select({
        message: "Metas Concluídas: "+ feitas.length,
        choices: [...feitas]
    })
}

async function MetasAbertas() {
    const abertas = metas.filter((meta) => {
        return !meta.checked
    })
    if(abertas.length == 0){
        mensage = "Não há metas abertas!"
        return
    }
    await select({
        message: "Metas A Serem Feitas: "+ abertas.length,
        choices: [...abertas]
    })
}

async function Deletar(){
    const metanaofeita = metas.map((meta) => {
        return {value: meta.value, checked: false}
    })
    
    const deletar = await checkbox({
        message: "Selecione a meta: ",
        choices: [...metanaofeita],
        instructions: false
    })

    if(deletar.length == 0){
        mensage = "Não há metas para apagar!"
        return
    }
    deletar.forEach((item) => {
        metas = metas.filter((meta) => {
            return meta.value != item
        })
    })
    mensage = "Meta(s) deletada(s)!"
}

const msg = () => {
    
    console.clear();

    if(mensage != ""){
        console.log(mensage)
        console.log("")
        mensage = ""
    }
}

async function Load() {
    try{
        const dados = await fs.readFile("metas.json", "utf-8")
        metas = JSON.parse(dados)
    }
    catch(erro) {
        metas = []
    }
}

async function Save() {
    await fs.writeFile("metas.json", JSON.stringify(metas, null, 2))
}

async function Start() {
    await Load()

    while(true){
        msg()
        await Save()
        
        const opcao = await select({
            message: "Menu",
            choices: [
                {
                    name: "Cadastrar meta",
                    value: "cad"
                },
                {
                    name: "Listar metas",
                    value: "list"
                },
                {
                    name: "Remover metas",
                    value: "del"
                },
                {
                    name: "Sair",
                    value: "exit"
                }
            ]
        })
        switch(opcao){
            case "cad":
                await Cadastrar()
            break
            case "list":
                const list = await select({
                    message: "Que tipo de listagem gostaria?",
                    choices: [
                        {
                            name: "Ver todas as metas",
                            value: "all"
                        },
                        {
                            name: "Ver apenas metas abertas",
                            value: "open"
                        },
                        {
                            name: "Ver apenas metas feitas",
                            value: "done"
                        },
                    ]
                })
                switch (list) {
                    case "all":
                        await Listar()
                    break;
                    case "done":
                        await MetasFeitas()
                    break
                    case "open":
                        await MetasAbertas()
                    break
                }
            break
            case "del":
                await Deletar()
            break
            case "exit":
                console.log("Saindo!")
            return
        }
    }
}
Start()