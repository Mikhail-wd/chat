import Server from "http"
import file from "fs"

import eventEmitter from "events"

const port = 8080

let messages = [
    { name: "TestUser", message: "Welcome", user_color: "#fff", image_link: null }
]
let usersList = []

const EventEmitter = new eventEmitter.EventEmitter()

EventEmitter.on("add_message", function (value) {
    let tempUsers_id = []
    value.selected_users?.map(element => tempUsers_id.push(element.user_id))
    if (value.image_link === null) {
        messages.unshift({
            name: value.name,
            message: value.message,
            user_color: value.user_color,
            image_link: value.image_link,
            selected_users: value.selected_users,
            selected_id: tempUsers_id
        })
    } else if (value.image_link !== null) {
        messages.unshift({
            name: value.name,
            message: value.message,
            user_color: value.user_color,
            image_link: value.image_link,
            selected_users: value.selected_users,
            selected_id: tempUsers_id
        })
    }
})

EventEmitter.on("add_user", function (value) {
    let allId = []
    usersList.map(element => allId.push(element.user_id))
    let tempObject = JSON.parse(value)
    if (usersList.length > 0) {
        if (allId.includes(tempObject.user_id)) {
            let index = allId.findIndex(element => element === tempObject.user_id)
            usersList[index].expired = new Date().getTime() + 10000
            usersList[index].user_color = tempObject.user_color
            usersList[index].user_name = tempObject.user_name
        } else {
            usersList.push({ user_color: tempObject.user_color, user_name: tempObject.user_name, user_id: tempObject.user_id, expired: new Date().getTime() + 10000 })
        }
    } else if (usersList.length === 0) {
        usersList.push({ user_color: tempObject.user_color, user_name: tempObject.user_name, user_id: tempObject.user_id, expired: new Date().getTime() + 10000 })
    }
    console.log("User: " + tempObject.user_name + " enter chat.")
})

EventEmitter.on("check_message_lenght", function (value) {
    let tempArray = []
    if (value.length >= 500) {
        tempArray = value.slice(0, 500)
        console.log("messages is sliced and equale : " + tempArray.length)
        messages = tempArray
    }
})



const server = Server.createServer((req, res) => {

    const reqMethod = req.method
    const reqImag = req.url.split("/")
    const reqUrl = req.url

    if (reqUrl === "/") {
        res.writeHead(200, {
            "Content-Type": "application/json",
            'Access-Control-Allow-Origin': '*'
        });
        res.write(JSON.stringify(messages))
        res.end()
    }
    else if (reqUrl === "/chat-api/get-messages") {
        res.writeHead(200, {
            "Connection": "keep-alive",
            'Content-Type': 'text/event-stream',
            "Access-Control-Allow-Origin": "https://online-chat-blond.vercel.app",
            "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept"
        });
        EventEmitter.emit("check_message_lenght", messages)
        EventEmitter.addListener("add_message", () => res.write(`data:${JSON.stringify(messages)}\n\n`))
    }
    else if (reqUrl === "/chat-api/init-get-messages") {
        res.writeHead(200, {
            "Connection": "keep-alive",
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "https://online-chat-blond.vercel.app",
            "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept"
        });
        res.write(JSON.stringify(messages))
        res.end()
    }
    // else if (reqImag[1] === "assets") {
    //     console.log("Assets loading")
    //     file.readFile(`../dist${req.url}`, (err, data) => {
    //         if (req.url.endsWith('.html')) {
    //             file.readFile("../dist/index.html", (err, data) => {
    //                 res.writeHead(200, { 'Content-Type': 'text/html', 'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept' })
    //                 res.write(data)
    //                 res.end()
    //             })
    //         }
    //         if (req.url.endsWith('.css')) {
    //             res.writeHead(200, {
    //                 'Content-Type': 'text/css'
    //             })
    //             res.write(data)
    //             res.end()
    //             return
    //         } if (req.url.endsWith('.gif')) {
    //             res.writeHead(200, {
    //                 'Content-Type': ' image/gif'
    //             })
    //             res.write(data)
    //             res.end()
    //             return
    //         }
    //         if (req.url.endsWith('.woff')) {
    //             res.writeHead(200, {
    //                 'Content-Type': 'text/css'
    //             })
    //             res.write(data)
    //             res.end()
    //             return
    //         }
    //         if (req.url.endsWith('.ttf')) {
    //             res.writeHead(200, {
    //                 'Content-Type': 'text/css'
    //             })
    //             res.write(data)
    //             res.end()
    //             return
    //         }
    //         if (req.url.endsWith('.js') || req.url.endsWith('.map')) {
    //             res.writeHead(200, {
    //                 'Content-Type': 'text/javascript'
    //             })
    //             res.write(data)
    //             res.end()
    //             return
    //         }
    //         if (req.url.endsWith('.png')) {
    //             res.writeHead(200, {
    //                 'Content-Type': ' image/png'
    //             })
    //             res.write(data)
    //             res.end()
    //             return
    //         }
    //         if (req.url.endsWith('.jpeg')) {
    //             res.writeHead(200, {
    //                 'Content-Type': ' image/jpeg'
    //             })
    //             res.write(data)
    //             res.end()
    //             return
    //         }
    //         if (req.url.endsWith(".webm")) {
    //             res.writeHead(200, {
    //                 'Content-Type': 'video/webm'
    //             })
    //             res.write(data)
    //             res.end()
    //             return
    //         }
    //         if (req.url.endsWith(".ico")) {
    //             res.writeHead(200, {
    //                 'Content-Type': 'image/avif'
    //             })
    //             res.write(data)
    //             res.end()
    //             return
    //         }
    //     })
    // }
    else if (reqUrl === "/chat-api/message") {
        req.on('data', (data) => {
            if (data) {
                EventEmitter.emit("add_message", JSON.parse(data))
            } else {
                Console.log("Error in 186")
            }
        }
        )
        res.writeHead(200, {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "https://online-chat-blond.vercel.app",
            "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept"
        });
        res.write(JSON.stringify("Message sended"))
        res.end()
    }
    else if (reqUrl === "/chat-api/get-users") {
        // res.writeHead(200, {
        //     "Access-Control-Allow-Origin": "http://localhost:5173",
        //     "Content-Type": "application/json"
        // });
        // res.write(JSON.stringify(usersList))
        // res.end()
        res.writeHead(200, {
            "Connection": "keep-alive",
            'Content-Type': 'text/event-stream',
            'Access-Control-Allow-Origin': '*',
            "Cache-Control": "no-cache",
        });
        EventEmitter.addListener("add_user", () => res.write(`data:${JSON.stringify(usersList)}\n\n`))
    }
    else if (reqUrl === "/chat-api/enter-chat") {
        req.on('data', (data) => {
            if (data) {
                EventEmitter.emit("add_user", data)
            } else {
                console.log("Error on 220")
            }
        }
        )
        res.writeHead(200, {
            "Content-Type": "application/json",
            'Access-Control-Allow-Origin': '*',
        });
        res.write(JSON.stringify(usersList))
        res.end()
    }
    else if (reqUrl === "/chat-api/exit-chat") {
        req.on('data', (data) => {
            let tempObject = JSON.parse(data)
            console.log(tempObject)
        }
        )
        res.writeHead(200, {
            "Access-Control-Allow-Origin": "http://localhost:5173",
            "Content-Type": "application/json",
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Allow-Methods": 'OPTIONS,POST,GET'
        });
        res.write(JSON.stringify("User  enter chat"))
        res.end()
        console.log("User Leave")
    }

})
setInterval(() => {
    let timer = new Date().getTime()
    let toDelite = usersList.filter(element => element.expired > timer)
    usersList = toDelite
}, 3000)
server.listen(port)
console.log("Server is function")
