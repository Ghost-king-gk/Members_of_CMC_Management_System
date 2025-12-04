export function escapeHtml(s) {
        return s.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
    }// 转义 HTML 特殊字符，防止 XSS 攻击, 返回转义后的字符串

export function sleep(ms) {
    return new Promise(r => setTimeout(r, ms));
}// 返回一个在指定秒数后解析的 Promise 对象,用于模拟延迟操作m