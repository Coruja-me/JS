const {select, input, checkbox} = require('@inquirer/prompts')

let metas = []

async function Cadastrar(){
    const meta = await input({message: "Digite a meta: "})

    if(meta.length <= 3){
        console.log("A meta não pode ser menor que 3 caracteres!")
        return Cadastrar()
    }
    metas.push({
        value: meta, checked: false
    })
}

async function Listar() {
    const resposta = await checkbox({
        message: "Use as setas para mudar de meta, o espaço para marcar ou desmarcar e o Enter para finalizar",
        choices: [...metas]
    })

    if(resposta.length == 0){
        console.log("Nenhuma meta selecionada!")
        return
    }
    metas.forEach((m) => {
        m.checked = false
    })
    resposta.forEach((resposta) => {
        const meta = metas.find((m) => {
            return m.value == resposta
        })
        meta.checked = true
    })
    console.log("Meta(s) finalizada(s)!")
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
        message: "Metas Concluídas:",
        choices: [...feitas]
    })
}

async function Start() {
    console.log("Bem Vindo!")

    while(true){
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
                    name: "Ver metas feitas",
                    value: "done"
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
                await Listar()
            break
            case "done":
                await MetasFeitas()
            break
            case "exit":
                console.log("Saindo!")
            return
        }
    }
}
Start()