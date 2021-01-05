import { ApplyOptions } from '@sapphire/decorators';
import type { CommandOptions, Args } from '@sapphire/framework';
import { Message, MessageEmbed, TextChannel } from 'discord.js';
import SapphireCommand from '#lib/SapphireCommand';

@ApplyOptions<CommandOptions>({
	aliases: ['b'],
	category: 'Moderation',
	description: 'Bans a member from the server',
	preconditions: ['OwnerOnly', 'AdminOnly', 'ModeratorOnly']
})
export default class BanCommand extends SapphireCommand {
    public async run(message: Message, args: Args) {
		const user = await args.pick('user');
		if (!user) throw '**User not provided.** Users can be either an id or mention.';
        const member = await message.guild!.members.fetch(user?.id).catch(() => null);
		if (!member) throw '**Member not found.** Please make sure the user is in this guild.';
        if (member.id === message.author.id) return message.reply('I don\'t think you want to ban yourself.');
        if (!member.bannable) return message.reply('I cannot ban that member, their role is probably higher than my own!');
        // const user = msg.mentions.users.first();
        let reason = await args.rest('string').catch(() => null);
        reason = reason !== null ? reason : 'No reason given by staff';

		if (reason && reason.length > 1000) throw 'Reason maximum char length is 1000.';
        member.ban({ reason: reason as string })
        // member.ban(reason !== '' ? reason : 'No reason given by staff');
		const modlogsChannel = this.context.client.channels.cache.get('683163930344161310') as TextChannel;
        const banEmbed = new MessageEmbed()
        .setColor(message.member?.displayHexColor as string)
        .setDescription(`
          **Member:** ${member.user.tag} (${member.id})\n
          **Action:** Ban\n
          **Reason:** ${reason}`
        );
    
        message.channel.send(`Successfully banned ${member.user.tag} (${member.id}, reason: ${reason}`);
        return modlogsChannel.send(banEmbed);
    }
}