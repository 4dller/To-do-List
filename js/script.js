//Estes são seletores do DOM usando document.querySelector e document.querySelectorAll, que selecionam elementos HTML da página. Por exemplo, input seleciona o elemento <input>, addButton seleciona o botão com a classe .add-button, etc.

const input = document.querySelector("input");
const addButton = document.querySelector(".add-button");
const todosHtml = document.querySelector(".todos");
const emptyImage = document.querySelector(".empty-image");

//let todosJson - Isso recupera os dados salvos do localStorage usando a chave "todos". Se não houver dados salvos, todosJson será um array vazio.

let todosJson = JSON.parse(localStorage.getItem("todos")) || [];

const deleteAllButton = document.querySelector(".delete-all");
const filters = document.querySelectorAll(".filter");
let filter = '';

//Essas funções abaixo são essenciais para o funcionamento da aplicação de lista de tarefas, pois lidam com a adição, remoção e atualização do estado das tarefas, além de garantir que as alterações sejam refletidas na interface do usuário e persistentes entre sessões usando o armazenamento local.

showTodos();

function getTodoHtml(todo, index) {
  if (filter && filter != todo.status) {
    return '';
  }
  let checked = todo.status == "completed" ? "checked" : "";
  return /* html */ `
    <li class="todo">
      <label for="${index}">
        <input id="${index}" onclick="updateStatus(this)" type="checkbox" ${checked}>
        <span class="${checked}">${todo.name}</span>
      </label>
      <button class="delete-btn" data-index="${index}" onclick="remove(this)"><i class="fa fa-times"></i></button>
    </li>
  `; 
}

//Esta função é responsável por gerar o HTML para representar uma tarefa na lista. Recebe como parâmetro um objeto todo representando a tarefa e o seu índice index na lista de tarefas. Verifica se há um filtro aplicado e se o status da tarefa corresponde ao filtro. Se corresponder, retorna uma string HTML representando a tarefa com um checkbox para marcar como concluída e um botão para excluir.

function showTodos() {
  if (todosJson.length == 0) {
    todosHtml.innerHTML = '';
    emptyImage.style.display = 'block';
  } else {
    todosHtml.innerHTML = todosJson.map(getTodoHtml).join('');
    emptyImage.style.display = 'none';
  }
}

//Esta função exibe as tarefas na página. Verifica se a lista de tarefas está vazia e atualiza a exibição de acordo, mostrando ou ocultando a imagem vazia. Se houver tarefas, gera o HTML para cada uma delas usando a função getTodoHtml e as exibe na página.

function addTodo(todo)  {
  input.value = "";
  todosJson.unshift({ name: todo, status: "pending" });
  localStorage.setItem("todos", JSON.stringify(todosJson));
  showTodos();
}

//Esta função adiciona uma nova tarefa à lista de tarefas. Recebe como parâmetro uma string todo representando a descrição da tarefa a ser adicionada. Limpa o campo de entrada, adiciona a nova tarefa ao início da lista de tarefas, atualiza o armazenamento local e chama a função showTodos() para atualizar a exibição na página.

input.addEventListener("keyup", e => {
  let todo = input.value.trim();
  if (!todo || e.key != "Enter") {
    return;
  }
  addTodo(todo);
});

addButton.addEventListener("click", () => {
  let todo = input.value.trim();
  if (!todo) {
    return;
  }
  addTodo(todo);
});

function updateStatus(todo) {
  let todoName = todo.parentElement.lastElementChild;
  if (todo.checked) {
    todoName.classList.add("checked");
    todosJson[todo.id].status = "completed";
  } else {
    todoName.classList.remove("checked");
    todosJson[todo.id].status = "pending";
  }
  localStorage.setItem("todos", JSON.stringify(todosJson));
}

//Esta função é chamada quando um checkbox de uma tarefa é clicado, atualizando o status da tarefa para concluído ou pendente. Recebe como parâmetro o elemento todo que representa o checkbox clicado. Altera a classe CSS da descrição da tarefa para indicar se ela está concluída ou não e atualiza o status da tarefa na lista de tarefas. Em seguida, atualiza o armazenamento local com a nova lista de tarefas.

function remove(todo) {
  const index = todo.dataset.index;
  todosJson.splice(index, 1);
  showTodos();
  localStorage.setItem("todos", JSON.stringify(todosJson));
}

//Esta função é chamada quando o botão de exclusão de uma tarefa é clicado. Remove a tarefa correspondente da lista de tarefas com base no índice fornecido no atributo data-index do botão. Em seguida, chama a função showTodos() para atualizar a exibição na página e atualiza o armazenamento local.

filters.forEach(function (el) {
  el.addEventListener("click", (e) => {
    if (el.classList.contains('active')) {
      el.classList.remove('active');
      filter = '';
    } else {
      filters.forEach(tag => tag.classList.remove('active'));
      el.classList.add('active');
      filter = e.target.dataset.filter;
    }
    showTodos();
  });
});

//Este event listener é aplicado a cada elemento dentro do conjunto de elementos selecionados pela classe .filter. Para cada elemento, é adicionado um event listener para o evento de clique. Quando um elemento é clicado, a função associada é chamada. A função verifica se o elemento clicado já está ativo (possui a classe .active). Se estiver ativo, remove a classe .active do elemento e limpa o filtro. Caso contrário, remove a classe .active de todos os elementos, adiciona a classe .active ao elemento clicado e define o filtro com base no atributo data-filter do elemento clicado. Em seguida, chama a função showTodos() para atualizar a exibição das tarefas na página, levando em consideração o filtro aplicado.

deleteAllButton.addEventListener("click", () => {
  todosJson = [];
  localStorage.setItem("todos", JSON.stringify(todosJson));
  showTodos();
});

//Este event listener é acionado quando o botão de exclusão de todas as tarefas (<button> com a classe .delete-all) é clicado. A função associada é chamada sempre que o botão é clicado. A função redefine a lista de tarefas como um array vazio, limpa o armazenamento local e chama a função showTodos() para limpar a exibição das tarefas na página.