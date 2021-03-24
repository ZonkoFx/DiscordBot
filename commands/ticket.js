const config = require('../config.json'),
    fs = require('fs'),
    Discord = require('discord.js')
 
module.exports = {
    run: async (message, args, client) => {
        if (Object.values(client.db.tickets).some(ticket => ticket.author === message.author.id)) return message.channel.send('Vous avez déjà un ticket d\'ouvert.')
        const channel = await message.guild.channels.create(`ticket ${message.author.username}`, {
            type: 'text',
            parent: config.ticket.category,
            permissionOverwrites: [{
                id: message.guild.id,
                deny: 'VIEW_CHANNEL'
            }, {
                id: message.author.id,
                allow: 'VIEW_CHANNEL'
            }, ...config.ticket.roles.map(id => ({
                id,
                allow: 'VIEW_CHANNEL'
            }))]
        })
        client.db.tickets[channel.id] = {
            author: message.author.id
        }
        fs.writeFileSync('./db.json', JSON.stringify(client.db))
        channel.send(new Discord.MessageEmbed()
            .setDescription(`${message.member}, Nous allons nous occuper de ton ticket.
            
            **• Vos fonds seront transferés en 24H maximum sur votre compte Paypal.**
            
        \`-Email paypal 

        -Code paysafecard   

        -Montant de la paysafecard \` `))
    },
    name: 'ticket',
    guildOnly: true,
    help: {
        description: 'Cette commande vous permet de créer un Ticket.'
    }
}