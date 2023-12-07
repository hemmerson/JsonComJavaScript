onload=function(){
    limparFormulario();
    document.getElementById("btAdicionarInputAutor").onclick=adicionarInputAutor
    document.getElementById("btInserir").onclick=inserir;
    mostrar();
}
function pegaLivriaria()
{
    if(localStorage.livraria==undefined)
        this.localStorage.livraria="[]";
    return JSON.parse(localStorage.livraria);
}
function salvar(livraria)
{
    localStorage.livraria=JSON.stringify(livraria);
}
function pegaLivroDaInterface()
{
    const inputs=document.querySelectorAll(".autor");
    const autores=[];
    for(let input of inputs)
        autores.push(input.value);

    return {
        titulo:document.getElementById("titulo").value,
        autor:autores,
        ano:document.getElementById("ano").value,
        preco:document.getElementById("preco").value
    };
}
function inserir(evento){
    evento.preventDefault();
    //pegar dados da interface
    const livro=pegaLivroDaInterface();
    //pegar a livraria
    const livraria=pegaLivriaria();
    //inserir o livro na livraria
    livraria.push(livro);
    //salvar a livraria
    salvar(livraria);
    mostrar();
}
function adicionarInputAutor()
{
    const botao=document.getElementById("btAdicionarInputAutor");
    const pai=botao.parentNode;
    const input = document.createElement("input");
    input.setAttribute("placeholder","Autor");
    //input.setAttribute("class","autor");
    input.classList.add("autor");

    const botaoDeletaInput=document.createElement("input");
    botaoDeletaInput.setAttribute("type","button");
    botaoDeletaInput.setAttribute("value","-");
    botaoDeletaInput.onclick=removeInputAutor
    const div=document.createElement("div");

    div.appendChild(input);
    div.appendChild(botaoDeletaInput);
    pai.insertBefore(div,botao);

    return input;
}

function removeInputAutor(evento)
{
    const botao=evento.target;
    const div=botao.parentNode;
    div.parentNode.removeChild(div);
}

function mostrar()
{
    const livraria=pegaLivriaria();
    let texto="";
    for(let livro of livraria)
        texto+=deLivroParaLinha(livro)
    document.querySelector("tbody").innerHTML=texto;
    ligaFuncaoDeletarNosBotoes();
    ligaFuncaoEditarNosBotoes();
    limparFormulario();
}
// {
//     titulo:"asdfa",
//     auto:["asdfaf","adsfafsa"],
//     ano:"1234",
//     preco:"asdfaf"
// }
function deLivroParaLinha(livro)
{
    return `<tr>
        <td>${livro.titulo}</td>
        <td><ul> ${livro.autor.map(a => "<li>"+a+"</li>").join("")} </ul></td>
        <td>${livro.ano}</td>
        <td>${livro.preco}</td>
        <td><input data-titulo="${livro.titulo}" type=button value=Deletar></td>
        <td><input data-titulo="${livro.titulo}" type=button value=Editar></td>
    </tr>`;
}
function deletar(evento)
{
    const titulo=evento.target.getAttribute("data-titulo");
    //pega a livriaria
    const livraria=pegaLivriaria();
    console.log(livraria)
    //busca pelo titulo
    const indice=pegaIndiceDoLivro(titulo,livraria);
    console.log(indice);
    //deleta o objeto(livro) encontrado
    if(indice>=0)
        //delete livraria[indice];
        livraria.splice(indice,1);
    //salva no localstorage
    console.log(livraria)
    salvar(livraria);
    mostrar();
}
function pegaIndiceDoLivro(titulo,livraria)
{
    for(let i in livraria)
    {
        const livro=livraria[i];
        if(livro.titulo===titulo)
            return i;
    }
    return -1;
}
function ligaFuncaoDeletarNosBotoes(){
    const botoes=document.querySelectorAll("input[value=Deletar]");
    for(let botao of botoes)
        //botao.onclick=deletar;
        botao.addEventListener("click",deletar);
}

function ligaFuncaoEditarNosBotoes(){
    const botoes=document.querySelectorAll("input[value=Editar]");
    for(let botao of botoes)
        //botao.onclick=deletar;
        botao.addEventListener("click",copiaParaInterface);
}

function copiaParaInterface(evento){
    const titulo=evento.target.getAttribute("data-titulo");
    //pega a livraria
    const livraria=pegaLivriaria();
    //busca pelo titulo
    const livro=pegaLivrodaLivraria(titulo,livraria);
    const indice=pegaIndiceDoLivro(titulo,livraria);
    document.getElementById("indice").value=indice;
    document.getElementById("titulo").value=livro.titulo;
    document.getElementById("ano").value=livro.ano;
    document.getElementById("preco").value=livro.preco;
    const autores = livro.autor;
    const tam = autores.length;

    for(let i=0;i<tam;i++)
    {
        const autor=autores[i];
        if(i==0)
        {
            document.querySelector("input[class=autor]").value=autor;
        }
        else
        {
            const input=adicionarInputAutor();
            input.value=autor;
        }
    }
    const botaoInserir=document.getElementById("btInserir");
    botaoInserir.value="Salvar";
    botaoInserir.onclick=editar;
}

function pegaLivrodaLivraria(titulo, livraria){
    for(let livro of livraria){
        if(livro.titulo == titulo)
            return livro;
    }
    return null;
}

function editar(evento){
    evento.preventDefault();
    //pega o indice passado para o hidden indice, criado no html
    const indice = document.getElementById("indice").value
    //pega a livraria
    const livraria=pegaLivriaria();
    //pega o livro da livraria que tem o indice = 'indice'
    let livro = livraria[indice];
    //atualiza o livro de acordo com os valores da interface
    livro = pegaLivroDaInterface();
    //atualiza a livraria, colocando o livro atualizado no indice
    livraria[indice] = livro;
    //salva livraria
    salvar(livraria);
    mostrar();
}

function limparFormulario()
{
    document.getElementById("indice").value="";
    document.getElementById("titulo").value="";
    document.getElementById("titulo").focus();
    document.getElementById("ano").value="";
    document.getElementById("preco").value="";
    document.querySelector("input[class=autor]").value="";
    const container=document.querySelector("fieldset");
    const divs=container.getElementsByTagName("div");
    const tam=divs.length;
    for(let i=0;i<tam;i++)
        container.removeChild(divs[0]);
    const botao = document.getElementById("btInserir");
    botao.onclick=inserir;
    botao.value="Inserir";

}