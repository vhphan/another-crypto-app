export const convertUnixToHuman = (unix, unit = 'ms') => {

    const date = unit === 'ms' ? new Date(unix) : new Date(unix * 1000);
    const year = date.getFullYear();
    const month = months[date.getMonth()];
    const day = date.getDate();
    const hour = date.getHours();
    const minute = date.getMinutes();
    const second = date.getSeconds();
    return `${year}-${month}-${day} ${hour}:${minute}:${second}`;

};