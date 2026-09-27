// src/ui.ts
export const uiHtml = `<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<title>todo-api 確認用UI</title>
<style>
  body { font-family: sans-serif; max-width: 680px; margin: 40px auto; padding: 0 16px; background: #0f1117; color: #e8ecf5; }
  h1 { font-size: 20px; }
  form#add-form { display: flex; gap: 8px; margin-bottom: 24px; }
  input[type=text], select, input[type=number] {
    padding: 8px; border-radius: 6px; border: 1px solid #4c8dff; background: #1b2230; color: #e8ecf5;
  }
  input#title { flex: 1; }
  button { padding: 8px 16px; border-radius: 6px; border: none; background: #4c8dff; color: white; cursor: pointer; }
  ul { list-style: none; padding: 0; }
  li { padding: 12px; margin-bottom: 8px; background: #1b2230; border-radius: 8px; }
  li.done .title-text { text-decoration: line-through; color: #6b7280; }
  .row { display: flex; justify-content: space-between; align-items: center; gap: 12px; }
  .main { display: flex; align-items: center; gap: 10px; flex: 1; }
  .meta { font-size: 12px; color: #9aa5b8; }
  .pending { color: #f5a623; }
  .actions { display: flex; gap: 6px; }
  .edit { background: #f5a623; padding: 4px 10px; font-size: 12px; }
  .del { background: #e0596a; padding: 4px 10px; font-size: 12px; }
  .save { background: #34d399; padding: 4px 10px; font-size: 12px; }
  .cancel { background: #6b7280; padding: 4px 10px; font-size: 12px; }
  .edit-form { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 8px; align-items: center; }
  .edit-form input[type=text] { flex: 1; min-width: 160px; }
  .edit-form input[type=number] { width: 90px; }
</style>
</head>
<body>
  <h1>todo-api 確認用UI</h1>
  <form id="add-form">
    <input type="text" id="new-title" placeholder="やることを入力" required>
    <button type="submit">追加</button>
  </form>
  <ul id="list"></ul>

<script>
const CATEGORIES = ["仕事", "買い物", "家事", "健康", "学習", "その他"];
const PRIORITIES = ["高", "中", "低"];

function options(values, selected) {
  return values.map(v => \`<option value="\${v}" \${v === selected ? 'selected' : ''}>\${v}</option>\`).join('');
}

async function fetchTodos() {
  const res = await fetch('/api/todos');
  const todos = await res.json();
  renderList(todos);
}

function renderList(todos) {
  const list = document.getElementById('list');
  list.innerHTML = todos.map(t => \`
    <li class="\${t.done ? 'done' : ''}" data-id="\${t.id}">
      <div class="row">
        <div class="main">
          <input type="checkbox" class="done-checkbox" \${t.done ? 'checked' : ''}>
          <div>
            <div class="title-text">\${t.title}</div>
            <div class="meta">
              \${t.category
                ? \`category: \${t.category} / priority: \${t.priority} / \${t.estimated_minutes}分\`
                : '<span class="pending">分析中...</span>'}
            </div>
          </div>
        </div>
        <div class="actions">
          <button class="edit">編集</button>
          <button class="del">削除</button>
        </div>
      </div>
    </li>
  \`).join('');

  list.querySelectorAll('li').forEach(li => {
    const id = li.dataset.id;

    li.querySelector('.done-checkbox').addEventListener('change', async (e) => {
      await patchTodo(id, { done: e.target.checked });
    });

    li.querySelector('.del').addEventListener('click', async () => {
      await fetch('/api/todos/' + id, { method: 'DELETE' });
      fetchTodos();
    });

    li.querySelector('.edit').addEventListener('click', () => {
      openEditForm(li, todos.find(t => String(t.id) === id));
    });
  });
}

function openEditForm(li, todo) {
  // 既にeditフォームが開いていたら二重に開かない
  if (li.querySelector('.edit-form')) return;

  const form = document.createElement('div');
  form.className = 'edit-form';
  form.innerHTML = \`
    <input type="text" class="f-title" value="\${todo.title}">
    <select class="f-category">\${options(CATEGORIES, todo.category)}</select>
    <select class="f-priority">\${options(PRIORITIES, todo.priority)}</select>
    <input type="number" class="f-minutes" min="1" value="\${todo.estimated_minutes ?? 30}">
    <button class="save">保存</button>
    <button class="cancel" type="button">キャンセル</button>
  \`;
  li.appendChild(form);

  form.querySelector('.cancel').addEventListener('click', () => form.remove());
  form.querySelector('.save').addEventListener('click', async () => {
    await patchTodo(todo.id, {
      title: form.querySelector('.f-title').value,
      category: form.querySelector('.f-category').value,
      priority: form.querySelector('.f-priority').value,
      estimated_minutes: Number(form.querySelector('.f-minutes').value),
    });
    fetchTodos();
  });
}

async function patchTodo(id, fields) {
  await fetch('/api/todos/' + id, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(fields),
  });
}

document.getElementById('add-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const input = document.getElementById('new-title');
  await fetch('/api/todos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: input.value }),
  });
  input.value = '';
  fetchTodos();
});

fetchTodos();
setInterval(fetchTodos, 3000);
</script>
</body>
</html>`