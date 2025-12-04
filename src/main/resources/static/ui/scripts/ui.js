import * as utils from './utils.js';
import * as api from './api.js';
import * as effect from './effects.js';

export const main = document.getElementById('main');

export function showLoading() {
        main.innerHTML = '<p class="loading">加载中…</p>';
}

export function showError(err) {
        main.innerHTML = `<pre class="error">${utils.escapeHtml(String(err))}</pre>`;
}

export function renderMemberList(list) {
        if (!Array.isArray(list) || list.length === 0) {
            main.innerHTML = '<p>无成员数据。</p>';
            return;
        }
        const rows = list.map(m => `
      <tr>
        <td>${utils.escapeHtml(String(m.id))}</td>
        <td>${utils.escapeHtml(m.name||'')}</td>
        <td>${utils.escapeHtml(m.memberType||m.member_type||'')}</td>
        <td><button data-id="${utils.escapeHtml(String(m.id))}" class="viewBtn">查看</button></td>
      </tr>`).join('');
        main.innerHTML = `
      <table class="table">
        <thead><tr><th>ID</th><th>姓名</th><th>类型</th><th>操作</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
    `;
        document.querySelectorAll('.viewBtn').forEach(b => b.addEventListener('click', event => {
            effect.playRippleEffect(event.currentTarget, event);
            const id = event.currentTarget.getAttribute('data-id');
            api.fetchMember(id);
        }));
}

export function renderMemberDetail(payload) {
        // repository.findById 返回 Optional，后端如果直接返回可能是 {"present":true,"value":{...}} 或者后端已改为返回实体。
        // 这里做兼容：先尝试取 payload.value 或 payload
        const data = payload && payload.value ? payload.value : payload;  // 取 payload.value，如果没有则取 payload 本身
        // 含义是：如果 payload 存在且 payload.value 存在，则返回 payload.value，否则返回 payload 本身。
        // ？是 JavaScript 中的三元运算符，用于前面的根据条件表达式的真假来选择返回值。如果条件为真，返回冒号前的值；如果条件为假，返回冒号后的值。
        if (!data || Object.keys(data).length === 0) {   // Object.keys(data).length 获取对象 data 的属性数量。 如果为 0，则返回 true，表示对象为空。
            // 三个等号 === 是严格相等运算符，表示不仅值相等，而且类型也相等。
            // !逻辑运算符表示取非，即取反。 如果 data 为 null、undefined、0、false、NaN 或空字符串，则 !data 为 true。
            // || 是逻辑或运算符，表示只要有一个条件为真，就返回真。 这里的条件是 Object.keys(data).length === 0。
            main.innerHTML = '<p>未找到成员。</p>';
            // main.innerHTML 是用于设置或获取 HTML 元素的内容。 这里将 main 元素的内容设置为一个段落，显示“未找到成员。”的消息。
            return;
        }
        const html = Object.entries(data).map(([k,v]) =>
            // Object.entries(data) 是一个函数，用于将一个对象转换为一个数组，数组的元素是该对象中的属性名和属性值组成的数组。
            // 例如，{a:1, b:2} 会被转换为 [['a',1], ['b',2]]。
            // map 是数组下的一个方法，用于对数组的每个元素执行一个函数，并返回一个新的数组。
            /* 这里使用了解构赋值，将每个元素的属性名赋值给 k，属性值赋值给 v */
            // 例如，[['a',1], ['b',2]] 会被转换为 k='a', v=1 和 k='b', v=2。这个数组会被转换为两个表格行。
            `<tr>
                <th>${utils.escapeHtml(k)}</th>   <td>${utils.escapeHtml(String(v))}</td>
             </tr>` //tr 表示表格行，th 表示表头单元格，td 表示数据单元格。
            // 将每个属性名和属性值生成一个表格行，属性名放在表头单元格中，属性值放在数据单元格中。
            // 最后使用 join('') 将所有行连接成一个完整的表格字符串。 这里使用 join('') 是为了避免使用 + 连接字符串，因为 + 会导致性能问题。
        ).join('');
            // join 是数组下的一个方法，用于将数组的所有元素连接成一个字符串。 这里使用空字符串作为分隔符，表示不添加任何分隔符。
            // 最终生成的 html 变量是一个包含所有属性行的字符串，可以直接插入到表格中。
            // 最终将生成的表格字符串插入到 main 元素中，显示成员的详细信息。
            // 注意：这里没有对属性值进行特殊处理，直接转换为字符串并插入到表格中。如果属性值是对象或数组，可能需要进一步处理。
            /* 逻辑顺序：1. 获取成员数据，并判断是否为空。
                       2. 生成表格行。
                       3. 将所有行连接成一个完整的表格。
                       4. 将表格插入到 main 元素中。
                       5. 显示成员详细信息。 */
        main.innerHTML = `<table class="detail">${html}</table>`; // detail 是表格的类名，可以用于 CSS 样式。
}
