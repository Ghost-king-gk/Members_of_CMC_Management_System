export { fetchMemberById, fetchMemberList };

/**
 * 获取成员列表（用于侧边栏导航）
 * 通常只需要 id 和 name 字段
 */
async function fetchMemberList() {
    return fetch('/members')
        .then(res => {
            if (!res.ok) throw new Error('Network response was not ok');
            return res.json();
        });
}

async function fetchMemberById(id) {
    return fetch('/member/' + encodeURIComponent(id))
        .then(res => {
            if (!res.ok) throw new Error(res.status + ' ' + res.statusText);
            return res.json();
        });
}