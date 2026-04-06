function getCookie(name)  {
    const cookies = document.cookie.split('; ').map(item => item.split('='));
    return Object.fromEntries(cookies)[name];
}
console.log(getCookie('isAuth'))
function checkAuth() {
    let authPath = '';
    if (window.location.href.split('/')[window.location.href.split('/').length - 1] === 'dashboard.html') {
        authPath = 'pages/auth.html'
    } else {
        authPath = 'auth.html';
    }
    if (!getCookie('isAuth')) {
        window.location.href = authPath;
    }
}

checkAuth(); 