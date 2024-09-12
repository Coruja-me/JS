const {select} = require('@inquirer/prompts')

async function Start() {
    console.log("Bem Vindo!")

    while(true){
        const opcao = await select({
            message: "Menu",
            choices: [
                {
                    name:"Cadastrar meta",
                    value: "cad"
                },
                {
                    name:"Listar metas",
                    value: "list"
                },
                {
                    name:"Sair",
                    value: "exit"
                }
            ]
        })
        switch(opcao){
            case "cad":
                console.log("Cadastro!")
            break
            case "list":
                console.log("Cadastro!")
            break
            case "exit":
                console.log("Saindo!")
            return
        }
    }
}
Start()