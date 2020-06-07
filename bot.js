const Discord = require("discord.js")
const fs = require('fs')

const tokens = require('./tokens.json')
const client = new Discord.Client()
const commands = new Discord.Collection()
var modules

const hardcodedPrefix = "$"

client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}`)
    reload()
})

client.on("message", message => {
    if (!message.content.startsWith(hardcodedPrefix) || message.author.bot || !message.guild) return

    const arguments = message.content.slice(hardcodedPrefix.length).split(/ +/)
    const command = arguments.shift().toLowerCase()

    if (command == "reload") {
        reload(message)
    }

    if (!commands.has(command)) return

    try {
        commands.get(command).execute(message, arguments)
    } catch (error) {
        console.error(error)
    }
})

function reload(message) {
    modules = fs.readdirSync('./modules').filter(file => file.endsWith('.js'))
    var reloaded = "Added: "
    var i = 0
    for (file of modules) {
        const expansion = require(`./modules/${file}`)

        if (!commands.has(expansion.name)) {
            commands.set(expansion.name, expansion)
            if (i > 1) {
                reloaded = reloaded.concat(", ", expansion.name)
            }
            else {
                reloaded = reloaded.concat(expansion.name)
            }
            i++
        }
    }
    if (message) {
        if (reloaded != "Added: ") {
            message.channel.send(reloaded)
        }
    }
}

client.login(tokens.discord.token)