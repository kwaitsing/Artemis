export const socket = async () => {
    const socket = await fetch('/api/v1/servers', {
        method: 'GET'
    })
    return await socket.json()
}