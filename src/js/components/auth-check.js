export function getCookie(name)  {
    const cookies = document.cookie.replace('=', ':').split(';');
    return cookies;
}
