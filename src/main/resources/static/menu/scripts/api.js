export { fetchMemberById, fetchMemberList, createMember, updateMember, deleteMember, exportMembers };

const API_BASE = '/api';
const MEMBERS_BASE = API_BASE + '/members';
const ADMIN_MEMBERS_BASE = API_BASE + '/admin/members';

function mapHttpError(status, backendMessage, url) {
    const msg = (backendMessage || '').trim();
    if (msg) return msg;

    switch (status) {
        case 400:
            return '请求参数不合法（400）。';
        case 401:
        case 403:
            return '没有权限执行该操作（' + status + '）。';
        case 404:
            return '接口不存在（404），请检查路径是否拼写/大小写正确：' + url;
        case 405:
            return '请求方法不被允许（405），请检查后端是 GET/POST/DELETE 还是其他。';
        case 409:
            return '后端已存在该成员（409）。';
        case 500:
            return '服务器内部错误（500）。';
        default:
            if (status >= 500) return '服务器错误（' + status + '）。';
            return '请求失败（' + status + '）。';
    }
}

async function request(url, options = {}) {
    let res;
    try {
        res = await fetch(url, options);
    } catch (e) {
        const err = new Error('网络错误：无法连接到后端。');
        err.cause = e;
        throw err;
    }

    const ct = (res.headers.get('content-type') || '').toLowerCase();
    const isJson = ct.includes('application/json');

    let payload = null;
    try {
        payload = isJson ? await res.json() : await res.text();
    } catch {
        payload = null;
    }

    if (!res.ok) {
        // Spring Boot 默认错误体通常是 JSON: {status,error,message,path,...}
        const backendMessage = isJson && payload && typeof payload === 'object'
            ? (payload.message || payload.error || '')
            : (typeof payload === 'string' ? payload : '');

        const err = new Error(mapHttpError(res.status, backendMessage, url));
        err.status = res.status;
        err.url = url;
        err.payload = payload;
        throw err;
    }

    return payload;
}

/**
 * 获取成员列表（用于侧边栏导航）
 * 通常只需要 id 和 name 字段
 */
async function fetchMemberList() {
    return request(MEMBERS_BASE);
}

async function fetchMemberById(id) {
    return request(MEMBERS_BASE + '/' + encodeURIComponent(id));
}

async function createMember(data) {
    return request(MEMBERS_BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
}

async function deleteMember(id) {
    return request(MEMBERS_BASE + '/' + encodeURIComponent(id), { method: 'DELETE' });
}

async function exportMembers() {
    return request(ADMIN_MEMBERS_BASE + '/export', { method: 'POST' });
}

async function updateMember(id, data) {
    return request(MEMBERS_BASE + '/' + encodeURIComponent(id), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
}