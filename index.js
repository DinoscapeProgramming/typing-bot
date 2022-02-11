const { Client, Intents, Collection, Message, MessageEmbed, WebhookClient } = require('discord.js');
const fs = require('fs');
const config = require('./config.json');
let dashboardConfig = fs.readFileSync('./dashboardConfig.txt', 'utf8').toString()
if (!dashboardConfig) throw new Error("NO BOTDASH.PRO API CLIENT PROVIDED")
if (dashboardConfig.startsWith("process.env.")) {
  let dashboardBuffer = dashboardConfig
  dashboardConfig = eval(dashboardBuffer)
}
const botdash = require('botdash.pro');
const dashboard = new botdash.APIclient(dashboardConfig);
let token = fs.readFileSync('./token.txt', 'utf8').toString()
if (!token) throw new Error("NO TOKEN PROVIDED")
if (token.startsWith("process.env.")) {
  let tokenBuffer = token
  token = eval(tokenBuffer)
}

const client = new Client({
    messageCacheLifeTime: 60,
    fetchAllMembers: false,
    messageCacheMaxSkze: 10,
    restTimeOffset: 0,
    restWsBridgetimeout: 100,
    shards: "auto",
    disableEveryone: true,
    partials: ["MESSAGE"],
    intents: Intents.ALL
});

const disbut = require('discord-buttons');
disbut(client)
const slashCommandBuilder = require('discord-slash-commands-client');
const slash = new slashCommandBuilder.Client("OTIxNzg5NjczNTExMjExMDM5.Yb4BiA.DHDFjpEB2mCmmnFptHHxW7IjLzg", "921789673511211039")

client.on('ready', async () => {
    console.log("I'm now ready on " + await client.guilds.cache.size + " Servers!")
    const statusChannel = client.channels.cache.find(c => c.id === config.statusChannel)
    let embed = new MessageEmbed()
    .setColor('GREEN')
    .setAuthor(client.user.tag, client.user.displayAvatarURL())
    .setTitle("Successfully!")
    .setThumbnail("https://i.ibb.co/mHHdk5w/9-C00e3719-CC01-4-FBE-91-C5-6-A9-F25-ED1718.png")
    .setDescription("I'm now online on `" + client.guilds.cache.size + " Servers`\n\n```Servers: " + client.guilds.cache.size + "```")
    .setFooter(`Online on ${client.guilds.cache.size} Servers`, client.user.displayAvatarURL())
    .setTimestamp()
    statusChannel.send(embed)
    function command(commandName, commandDescription) {
        client.api.applications(client.user.id).commands.post({
            data: {
                name: commandName,
                description: commandDescription,
                options: [
                    {
                        type: 'SUB_COMMAND',
                        name: "start",
                        description: "Let the bot start typing"
                    },
                    {
                        type: 'SUB_COMMAND',
                        name: "stop",
                        description: "Let the bot stop typing"
                    },
                    {
                        type: 'SUB_COMMAND',
                        name: "start all",
                        description: "Let the bot start typing in all channels"
                    },
                    {
                        type: 'SUB_COMMAND',
                        name: "stop all",
                        description: "Let the bot stop typing in all channels"
                    }
                ]
            }
        })
    }
    if (1 === 2) {
    slash.createCommand({
        name: "typing start",
        description: "Let the bot start typing"
    })
    }
    if (1 === 2) {
    slash.createCommand({
        name: "typing stop",
        description: "Let the bot stop typing"
    })
    }
    if (1 === 2) {
    slash.createCommand({
        name: "typing start all",
        description: "Let the bot start typing in all"
    })
    }
    if (1 === 2) {
    slash.createCommand({
        name: "typing stop all",
        description: "Let the bot stop typing in all channels"
    })
    }
    if (typeof config.status === "string") {
        client.user.setActivity(config.status, {
            type: config.statusType
        })
    } else if (Array.isArray(config.status)) {
        let i = 0
        let interval = setInterval(function () {
            client.user.setActivity(config.status[i], {
                type: config.statusType
            })
            i++
            if (i >= config.status.length) {
                i = 0
            }
        }, Number(config.statusChangeDuration))
    }
})

client.on('guildCreate', async (guild) => {
    const serverChannel = client.channels.cache.find(chn => chn.id === config.serverChannel)
    const serverEmbed = new MessageEmbed()
    .setColor('GREEN')
    .setAuthor(client.user.tag, client.user.displayAvatarURL())
    .setTitle("Successfully!")
    .setThumbnail("https://i.ibb.co/mHHdk5w/9-C00e3719-CC01-4-FBE-91-C5-6-A9-F25-ED1718.png")
    .setDescription("I'm now online on `" + guild.name + "`\n\n```Server: " + guild.name + "\nMembers: " + guild.memberCount + "\nInvite: not available```")
    .setFooter(`${guild.name} • ${guild.memberCount}`)
    .setTimestamp()
    serverChannel.send(serverEmbed)
})

client.on('message', async (message) => {
    // settings
    if (message.channel.type === "dm") {
        const c = message.content
        if (c.startsWith("t!help") || c.startsWith("t!typing start") || c.startsWith("t!typing stop") || c.startsWith("t!setname") || c.startsWith("t!dashboard") || c.startsWith("t!leave")) {
            let embed = new MessageEmbed()
            .setColor('RED')
            .setAuthor(message.author.tag, message.author.displayAvatarURL())
            .setTitle("Error!")
            .setDescription("Error code: `400 (invalid format)`\n\n```Error: I can't run commands in DMs```")
            .setThumbnail("https://www.freeiconspng.com/uploads/error-icon-4.png")
            .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true }))
            message.channel.send(embed)
        }
        return;
    }
    const prefix = await dashboard.getVal(message.guild.id, "botprefix")
    const role = await dashboard.getVal(message.guild.id, "role")
    const roleCheck = message.guild.roles.cache.find(roleId => roleId.id === role)
    const setName = true
    
    // configuration
    const args = message.content.slice(prefix.length).trim().split(/ +/)
    const permissions = await dashboard.getVal(message.guild.id, "permissions")
    const errorChannel = client.channels.cache.find(chn => chn.id === config.errorChannel)
    
    // embeds
    const error = new MessageEmbed()
    .setColor('RED')
    .setAuthor(message.author.tag, message.author.displayAvatarURL())
    .setTitle("Error!")
    .setDescription("Error code: `403 (missing permissions)`\n\n```Missing permission: " + permissions + "```")
    .setThumbnail("https://www.freeiconspng.com/uploads/error-icon-4.png")
    .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true }))
    .setTimestamp()
    
    const error2 = new MessageEmbed()
    .setColor('RED')
    .setAuthor(message.author.tag, message.author.displayAvatarURL())
    .setTitle("Error!")
    .setThumbnail("https://www.freeiconspng.com/uploads/error-icon-4.png")
    .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true }))
    .setTimestamp()
    
    const error3 = new MessageEmbed()
    .setColor('RED')
    .setAuthor(message.author.tag, message.author.displayAvatarURL())
    .setTitle("Error!")
    .setDescription("Error code: `404 (role don't exists)`\n\n```Missing role: " + role + "```")
    .setThumbnail("https://www.freeiconspng.com/uploads/error-icon-4.png")
    .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true }))
    .setTimestamp()
    
    const embedTemplate = new MessageEmbed()
    .setColor('GREEN')
    .setAuthor(message.author.tag, message.author.displayAvatarURL())
    .setTitle("Successfully!")
    .setThumbnail("https://i.ibb.co/mHHdk5w/9-C00e3719-CC01-4-FBE-91-C5-6-A9-F25-ED1718.png")
    .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true }))
    .setTimestamp()
    
    // ping
    if (message.content.includes("<@" + client.user.id + ">") || message.content.includes("<@!" + client.user.id + ">")) {
        if (!message.channel.permissionsFor(message.guild.me).has('SEND_MESSAGES')) {
            let embed5 = error2
            embed5.setDescription("Error code: `403 (missing permissions)`\n\n```Command: Mention\nServer: " + message.guild.name + "\nChannel: " + message.channel.name + "\nMissing permission: Send Messages```")
            return message.author.send(embed5).catch(err => {
                let embed = error2
                embed.setDescription("Error code: `? (unexpected error)`\n\n```Error: " + err.message + "```")
                errorChannel.send(embed)
            })
        }
        message.channel.send(
        new MessageEmbed()
            .setColor('BLUE')
            .setAuthor(message.author.tag, message.author.displayAvatarURL())
            .setTitle("Hugh? I got pinged? Imma give you some help")
            .setDescription("To see all commands type: `" + prefix + "help`")
            .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
            .setFooter(`Made by Dinoscape#0001`, message.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp()
        )
    }
    
    // code
    if (message.content.startsWith(prefix + "help")) {
        if (!message.channel.permissionsFor(message.guild.me).has('SEND_MESSAGES')) {
            let embed5 = error2
            embed5.setDescription("Error code: `403 (missing permissions)`\n\n```Command: " + prefix + "help\nServer: " + message.guild.name + "\nChannel: " + message.channel.name + "\nMissing permission: Send Messages```")
            return message.author.send(embed5).catch(err => {
                let embed = error2
                embed.setDescription("Error code: `? (unexpected error)`\n\n```Error: " + err.message + "```")
                errorChannel.send(embed)
            })
        }
        message.channel.send(
        new MessageEmbed()
        .setColor('BLUE')
        .setAuthor(message.author.tag, message.author.displayAvatarURL())
        .setTitle("Typing Bot Help")
        .setDescription("Hey, I'm the typing bot.")
        .addField(`${prefix}help`, "This command")
        .addField(`${prefix}typing start`, "Let the bot start typing")
        .addField(`${prefix}typing stop`, "Let the bot stop typing")
        .addField(`${prefix}typing start all`, "Let the bot start typing in all channels")
        .addField(`${prefix}typing stop all`, "Let the bot stop typing in all channels")
        .addField(`${prefix}setname`, "Let the bot change its nickname")
        .addField(`${prefix}dashboard`, "Get the dashboard link for this server")
        .addField(`${prefix}leave`, "Let the bot leave from this server")
        .setThumbnail(client.user.displayAvatarURL())
        .setImage("https://i.ibb.co/xXV5yKy/95-C484-BD-4205-42-EA-82-F1-AB90732278-C3.jpg")
        .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true }))
        .setTimestamp()
        )
    }
    if (message.content === prefix + "typing start") {
        if (!message.channel.permissionsFor(message.guild.me).has('SEND_MESSAGES')) {
            let embed5 = error2
            embed5.setDescription("Error code: `403 (missing permissions)`\n\n```Command: " + prefix + "typing start\nServer: " + message.guild.name + "\nChannel: " + message.channel.name + "\nMissing permission: Send Messages```")
            return message.author.send(embed5).catch(err => {
                let embed = error2
                embed.setDescription("Error code: `? (unexpected error)`\n\n```Error: " + err.message + "```")
                errorChannel.send(embed)
            })
        }
        if (!message.member.hasPermission(permissions.toUpperCase().replace(/ /g, "_").replace("VOICE ACTIVITY DETECTION", "VAD"))) return message.channel.send(error);
        if (role != "none") {
            if (!roleCheck) return message.channel.send(error3);
            let embed = error2
            embed.setDescription("Error code: `403 (missing permissions)`\n\n```Missing role: " + roleCheck.name + "```")
            if (!message.member.roles.cache.has(role)) return message.channel.send(embed);
        }
        let embed = embedTemplate
        embed.setDescription("I'm successfully started typing in this channel now!\n\n```Channel: " + message.channel.name + "```")
        await message.channel.send(embed)
        message.channel.startTyping()
    }
    if (message.content === prefix + "typing stop") {
        if (!message.channel.permissionsFor(message.guild.me).has('SEND_MESSAGES')) {
            let embed5 = error2
            embed5.setDescription("Error code: `403 (missing permissions)`\n\n```Command: " + prefix + "typing stop\nServer: " + message.guild.name + "\nChannel: " + message.channel.name + "\nMissing permission: Send Messages```")
            return message.author.send(embed5).catch(err => {
                let embed = error2
                embed.setDescription("Error code: `? (unexpected error)`\n\n```Error: " + err.message + "```")
                errorChannel.send(embed)
            })
        }
        if (!message.member.hasPermission(permissions.toUpperCase().replace(/ /g, "_").replace("VOICE ACTIVITY DETECTION", "VAD"))) return message.channel.send(error);
        if (role != "none") {
            if (!roleCheck) return message.channel.send(error3);
            let embed = error2
            embed.setDescription("Error code: `403 (missing permissions)`\n\n```Missing role: " + roleCheck.name + "```")
            if (!message.member.roles.cache.has(role)) return message.channel.send(embed);
        }
        message.channel.stopTyping()
        let embed = embedTemplate
        embed.setDescription("I'm successfully stopped typing in this channel now!\n\n```Channel: " + message.channel.name + "```")
        message.channel.send(embed)
    }
    if (message.content.startsWith(prefix + "typing start all")) {
        if (!message.channel.permissionsFor(message.guild.me).has('SEND_MESSAGES')) {
            let embed5 = error2
            embed5.setDescription("Error code: `403 (missing permissions)`\n\n```Command: " + prefix + "typing start all\nServer: " + message.guild.name + "\nChannel: " + message.channel.name + "\nMissing permission: Send Messages```")
            return message.author.send(embed5).catch(err => {
                let embed = error2
                embed.setDescription("Error code: `? (unexpected error)`\n\n```Error: " + err.message + "```")
                errorChannel.send(embed)
            })
        }
        if (!message.member.hasPermission(permissions.toUpperCase().replace(/ /g, "_").replace("VOICE ACTIVITY DETECTION", "VAD"))) return message.channel.send(error);
        if (role != "none") {
            if (!roleCheck) return message.channel.send(error3);
            let embed = error2
            embed.setDescription("Error code: `403 (missing permissions)`\n\n```Missing role: " + roleCheck.name + "```")
            if (!message.member.roles.cache.has(role)) return message.channel.send(embed);
        }
        let embed = embedTemplate
        embed.setDescription("I'm started typing in all channels in this server now!\n\n```Server: " + message.guild.name + "```")
        await message.channel.send(embed)
        message.guild.channels.cache.forEach(c => {
            if (c.type === "text") {
                if (!c.permissionsFor(message.guild.me).has('SEND_MESSAGES')) return;
                if (!c.permissionsFor(message.guild.me).has('VIEW_CHANNEL')) return;
                c.startTyping()
            }
        })
    }
    if (message.content.startsWith(prefix + "typing stop all")) {
        if (!message.channel.permissionsFor(message.guild.me).has('SEND_MESSAGES')) {
            let embed5 = error2
            embed5.setDescription("Error code: `403 (missing permissions)`\n\n```Command: " + prefix + "typing stop all\nServer: " + message.guild.name + "\nChannel: " + message.channel.name + "\nMissing permission: Send Messages```")
            return message.author.send(embed5).catch(err => {
                let embed = error2
                embed.setDescription("Error code: `? (unexpected error)`\n\n```Error: " + err.message + "```")
                errorChannel.send(embed)
            })
        }
        if (!message.member.hasPermission(permissions.toUpperCase().replace(/ /g, "_").replace("VOICE ACTIVITY DETECTION", "VAD"))) return message.channel.send(error);
        if (role != "none") {
            if (!roleCheck) return message.channel.send(error3);
            let embed = error2
            embed.setDescription("Error code `403 (missing permissions)`\n\n```Missing role: " + roleCheck.name + "```")
            if (!message.member.roles.cache.has(role)) return message.channel.send(embed);
        }
        message.guild.channels.cache.forEach(c => {
            if (c.type === "text") {
                c.stopTyping()
            }
        })
        let embed = embedTemplate
        embed.setDescription("I'm stopped typing in all channels in this server now!\n\n```Server: " + message.guild.name + "```")
        message.channel.send(embed)
    }
    if (message.content.startsWith(prefix + "setname")) {
        if (!message.channel.permissionsFor(message.guild.me).has('SEND_MESSAGES')) {
            let embed5 = error2
            embed5.setDescription("Error code: `403 (missing permissions)`\n\n```Command: " + prefix + "setname\nServer: " + message.guild.name + "\nChannel: " + message.channel.name + "\nMissing permission: Send Messages```")
            return message.author.send(embed5).catch(err => {
                let embed = error2
                embed.setDescription("Error code: `? (unexpected error)`\n\n```Error: " + err.message + "```")
                errorChannel.send(embed)
            })
        }
        if (!message.member.hasPermission(permissions.toUpperCase().replace(/ /g, "_").replace("VOICE ACTIVITY DETECTION", "VAD"))) return message.channel.send(error);
        if (role != "none") {
            if (!roleCheck) return message.channel.send(error3);
            let embed = error2
            embed.setDescription("Error code: `403 (missing permissions)`\n\n```Missing role: " + roleCheck.name + "```")
            if (!message.member.roles.cache.has(role)) return message.channel.send(embed);
        }
        let embed2 = error2
        embed2.setDescription("Error code: `400 (invalid format)`\n\n```Server: " + message.guild.name + "```")
        if (!args.slice(1).join(' ')) return message.channel.send(embed2);
        let embed3 = error2
        embed3.setDescription("Error code: `400 (nickname too long)`\n\n```Nickname: " + args.slice(1).join(' ') + "```")
        let embed4 = error2
        embed4.setDescription("I'm not allowed to do that.\nError code: `403 (missing permissions)`\n\n```Missing permission: Change Nickname```")
        if (!message.guild.me.hasPermission('CHANGE_NICKNAME')) return message.channel.send(embed4)
        if (args.slice(1).join(' ').length >= 32) return message.channel.send(embed3);
        message.guild.members.cache.find(u => u.id === client.user.id).setNickname(args.slice(1).join(' ')).catch(err => {
            message.channel.send(err)
        })
        let embed = embedTemplate
        embed.setDescription("Successfully changed my nickname to `" + args.slice(1).join(' ') + "`\n\n```Nickname: " + args.slice(1).join(' ') + "```")
        message.channel.send(embed)
    }
    if (message.content.startsWith(prefix + "dashboard")) {
        if (!message.channel.permissionsFor(message.guild.me).has('SEND_MESSAGES')) {
            let embed5 = error2
            embed5.setDescription("Error code: `403 (missing permissions)`\n\n```Command: " + prefix + "dashboard\nServer: " + message.guild.name + "\nChannel: " + message.channel.name + "\nMissing permission: Send Messages```")
            return message.author.send(embed5).catch(err => {
                let embed = error2
                embed.setDescription("Error code: `? (unexpected error)`\n\n```Error: " + err.message + "```")
                errorChannel.send(embed)
            })
        }
        message.channel.send(
        new MessageEmbed()
            .setColor('BLUE')
            .setAuthor(message.author.tag, message.author.displayAvatarURL())
            .setTitle("Dashboard")
            .setDescription("__Here's your dashboard link:__\nhttps://typingbot.dinoscape.tk/my/manage/" + message.guild.id + "\n\n|| Note: Only mods can use this link ||")
            .setThumbnail("https://i.ibb.co/xXmFdxF/85-856344-dashboard-icon-monitoring-and-control-icon-removebg-preview.png")
            .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp()
        )
    }
    if (message.content.startsWith(prefix + "serverlist")) {
        const embed = new MessageEmbed()
            .setColor('BLUE')
            .setAuthor(message.author.tag, message.author.displayAvatarURL())
            .setTitle("Serverlist")
            .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp()
        var i = 0
        client.guilds.cache.forEach(guild => {
            if (i >= 1) return;
            embed.addField(guild.name, guild.memberCount + " Members")
            i++
        })
        var pageIndex = 1
        const backButton = new disbut.MessageButton()
        .setID("back")
        .setStyle("red")
        .setLabel("Back")
        .setEmoji("⬅️")
        const forwardButton = new disbut.MessageButton()
        .setID("forward")
        .setStyle("red")
        .setLabel("Forward")
        .setEmoji("➡️")
        const row = new disbut.MessageActionRow()
        .addComponents(backButton, forwardButton)
        message.channel.send(embed, {
            component: row
        }).then(msg => {
            let collector = new disbut.ButtonCollector(msg, button => button.clicker.id === message.author.id)
            collector.on("collect", async button => {
                if (button.id === "back") {
                    let newEmbed = new MessageEmbed()
                    .setColor('BLUE')
                    .setAuthor(message.author.tag, message.author.displayAvatarURL())
                    .setTitle("Serverlist")
                    .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true }))
                    .setTimestamp()
                    var i2 = i
                    i--
                    client.guilds.cache.forEach(guild => {
                        if (i >= i) return;
                        newEmbed.addField(guild.name, guild.memberCount + " Members")
                    })
                    await msg.edit("lol")
                } else if (button.id === "forward") {
                    let newEmbed = new MessageEmbed()
                    .setColor('BLUE')
                    .setAuthor(message.author.tag, message.author.displayAvatarURL())
                    .setTitle("Serverlist")
                    .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true }))
                    .setTimestamp()
                    var i = 1
                    pageIndex++
                    client.guilds.cache.forEach(guild => {
                        if (i <= (pageIndex * 1)) return;
                        if (i >= (pageIndex * 1 + 0)) return;
                        newEmbed.addField(guild.name, guild.memberCount + " Members")
                        i++
                    })
                    await msg.edit(newEmbed)
                }
            })
        })
    }
    if (message.content.startsWith(prefix + "leave")) {
        if (!message.member.hasPermission('MANAGE_GUILD') && message.author.username != "Dinoscape") return message.channel.send("You are not allowed to do that!");
        let embed = new MessageEmbed()
        .setColor('BLUE')
        .setAuthor(message.author.tag, message.author.displayAvatarURL())
        .setTitle("Assurance")
        .setDescription("Are you sure about that?")
        .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true }))
        .setTimestamp()
        let yesButton = new disbut.MessageButton()
        .setID("yes")
        .setStyle("red")
        .setLabel("Yes")
        .setEmoji("☑️")
        let noButton = new disbut.MessageButton()
        .setID("no")
        .setStyle("red")
        .setLabel("No")
        .setEmoji("❎")
        let row = new disbut.MessageActionRow()
        .addComponents(yesButton, noButton)
        await message.channel.send(embed, {
            component: row
        }).then(msg => {
            let collector = new disbut.ButtonCollector(msg, button => button.clicker.id === message.author.id)
            collector.on("collect", async button => {
                yesButton.setDisabled(true)
                noButton.setDisabled(true)
                let row2 = new disbut.MessageActionRow()
                .addComponents(yesButton, noButton)
                msg.edit(embed, {
                    component: row2
                })
                if (button.id === "yes") {
                    let embed2 = embedTemplate
                    embed2.setDescription("Successfully let the bot leave!\n\n```Server: " + message.guild.name + "```")
                    await button.reply.send(embed2)
                    message.guild.leave().catch(err => {
                        let embed3 = error2
                        embed3.setDescription("Error code: ? (unexpected error)\n\n```Error: " + err + "```")
                        button.reply.send(embed3)
                    })
                } else {
                    let embed2 = error2
                    embed2.setDescription("Successfully cancelled this occurrence!\n\n```Server: " + message.guild.name + "```")
                    button.reply.send(embed2)
                }
            })
        })
    }
})

client.ws.on('INTERACTION_CREATE', async (interaction) => {
    if (interaction.type != 2) return;
    console.log(interaction)
    const prefix = "/"
    function send(data) {
        client.api.interactions(interaction.id, interaction.token).callback.post({
            data: {
                type: 4,
                data: data
            }
        })
    }
    if (interaction.data.name === "help") {
        let embed = new MessageEmbed()
        .setColor('BLUE')
        .setAuthor(interaction.member.user.username + "#" + interaction.member.user.discriminator, "https://cdn.discordapp.com/avatars/" + interaction.member.user.id + "/" + interaction.member.user.avatar + ".png")
        .setTitle("Typing Bot Help")
        .setDescription("Hey, i'm the typing bot.")
        .addField(`${prefix}help`, "This command")
        .addField(`${prefix}typing start`, "Let the bot start typing")
        .addField(`${prefix}typing stop`, "Let the bot stop typing")
        .addField(`${prefix}typing start all`, "Let the bot start typing in all channels")
        .addField(`${prefix}typing stop all`, "Let the bot stop typing in all channels")
        .addField(`${prefix}setname`, "Let the bot change its nickname")
        .addField(`${prefix}dashboard`, "Get the dashboard link for this server")
        .addField(`${prefix}leave`, "Let the bot leave from this server")
        .setThumbnail(client.user.displayAvatarURL())
        .setImage("https://i.ibb.co/xXV5yKy/95-C484-BD-4205-42-EA-82-F1-AB90732278-C3.jpg")
        .setFooter(`Requested by ${interaction.member.user.username}#${interaction.member.user.discriminator}`, "https://cdn.discordapp.com/avatars/" + interaction.member.user.id + "/" + interaction.member.user.avatar + ".png")
        .setTimestamp()
        send({
            embeds: [embed]
        })
    } else if (interaction.data.name === "setname") {
        send({
            content: "hello world"
        })
    }
})
            
client.login(token)
