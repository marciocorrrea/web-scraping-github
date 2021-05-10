export function formatUrl(repository) {
    const url = repository.replace('https://', '').replace('github.com', '')
    return url[0] == '/' ? url : '/' + url;
}