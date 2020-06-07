module.exports = {
    name: "beep",
    description: "beeps, boops, and bops",
    async execute(message, arguments) {
        if (!arguments[0]) arguments = ["hello, beep"]
        await message.react("🤖")
        message.channel.send(arguments[0])
        .then(async newmessage => {
            await newmessage.react("🤖")
        })
    }
}