
export function logger(module: string, msg: string, time: boolean = true) {
    const timestamp = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', hour12: false})
    console.log(`${time ? timestamp + " " : ""}[${module}]: ${msg}`)
}