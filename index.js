const Discord = require('discord.js'),
    client = new Discord.Client({
        fetchAllMembers: true
    }),
    config = require('./config.json'),
    fs = require('fs')
 
    client.login(config.token)
    client.commands = new Discord.Collection()
    client.db = require('./db.json')
 
fs.readdir('./commands', (err, files) => {
    if (err) throw err
    files.forEach(file => {
        if (!file.endsWith('.js')) return
        const command = require(`./commands/${file}`)
        client.commands.set(command.name, command)
    })
})

client.on('message', message => {
    if (message.type !== 'DEFAULT' || message.author.bot) return
 
    const args = message.content.trim().split(/ +/g)
    const commandName = args.shift().toLowerCase()
    if (!commandName.startsWith(config.prefix)) return
    const command = client.commands.get(commandName.slice(config.prefix.length))
    if (!command) return
    if (command.guildOnly && !message.guild) return message.channel.send('Cette commande ne peut être utilisée que dans un serveur.')
    command.run(message, args, client)
})
 
client.on('guildMemberAdd', member => {
    member.guild.channels.cache.get(config.greeting.channel).send(new Discord.MessageEmbed()
        .setDescription(`**Ho ! Un nouveau membre !**
    🎉 Bienvenue ${member} sur le discord MultiConvert ! 🎉`)
        .setColor('#00ff00'))
    member.roles.add(config.greeting.role)
})
 
client.on('guildMemberRemove', member => {
    member.guild.channels.cache.get(config.greeting.channel).send(new Discord.MessageEmbed()
        .setDescription(`**Un membre vient de partir 😢** 
        À bientôt ${member.user.tag} 👋`)
        .setColor('#ff0000'))
})

client.on('ready', () => {
    const statuses = [
        () => `Convertir des codes Paysafecard en argent Paypal n'a jamais été aussi simple 😎`,
        () => `${client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)} Membres satisfaits`,
        () => `Taxe actuelle: 8% !`
    ]
    
    let i = 0
    setInterval(() => {
        client.user.setActivity(statuses[i](), {type: 'PLAYING'})
        i = ++i % statuses.length
    }, 1e4)
})

client.login(process.env.TOKEN);
