import * as ui from './ui.js';
import * as utils from './utils.js';

export async function fetchStatus() {
        ui.showLoading();
        try {
            const res = await fetch('/test');
            if (!res.ok) throw new Error(res.status + ' ' + res.statusText);
            const text = await res.text();
            ui.main.innerHTML = `<pre class="result">${utils.escapeHtml(text)}</pre>`;
        } catch (e) {
            ui.showError(e);
        }
    }

export async function fetchMemberList() {
        ui.showLoading();
        try {
            const res = await fetch('/members');
            if (!res.ok) throw new Error(res.status + ' ' + res.statusText);
            const json = await res.json();
            ui.renderMemberList(json);
        } catch (e) {
            ui.showError(e);
        }
    }

export async function fetchMember(id) {
        ui.showLoading();
        try {
            const res = await fetch('/member/' + encodeURIComponent(id));
            // 这行代码的意思是：获取指定 ID 的成员信息，获取到的数据格式为：{"present":true,"value":{...}}

            // 这里使用 encodeURIComponent 对 id 进行编码，防止特殊字符导致的 URL 问题。
            // fetch 是浏览器内置的用于发起 HTTP 请求的 API，返回一个 Promise 对象。
            // await 关键字用于等待 Promise 对象的解析结果。
            // const 是用于声明常量的关键字，表示 res 变量的值不会被重新赋值。Constance （缩写为Const） 是常量的意思。
            if (!res.ok) throw new Error(res.status + ' ' + res.statusText);
            const json = await res.json();  // 使用JSON（）函数把res 转化为 JSON 格式
            ui.renderMemberDetail(json);  // 渲染成员详情
        } catch (e) {
            ui.showError(e);
        }
    }