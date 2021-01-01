/* eslint-disable no-else-return */
import { ApplyOptions } from '@sapphire/decorators';
import type { CommandOptions, Args } from '@sapphire/framework';
import { Message, MessageEmbed, TextChannel, Role } from 'discord.js';
import SapphireCommand from '#lib/SapphireCommand';

@ApplyOptions<CommandOptions>({
	aliases: ['m'],
	category: 'Moderation',
	description: 'Mutes the selected member',
	preconditions: ['OwnerOnly', 'AdminOnly']
})
export default class MuteCommand extends SapphireCommand {
	public async run(message: Message, args: Args) {
		const user = await args.pick('user');
		const modlogsChannel = this.context.client.channels.cache.get('683163930344161310') as TextChannel;
		const member = await message.guild!.members.fetch(user.id).catch(() => null);

		if (member?.manageable) {
			const muteRole = message.guild?.roles.cache.find((role) => role.name === 'Muted') as Role;

			member.roles.add(muteRole);
			const muteEmbed = new MessageEmbed()
				.setColor(message.member?.displayHexColor as string)
				.setAuthor(message.author.tag, message.author.displayAvatarURL()).setDescription(`**Action:** Muted <@${member?.id}>\n
            **Duration:** Until manually removed\n`);
			message.channel.send(muteEmbed);
			return modlogsChannel.send(muteEmbed);
		} else {
			return message.channel.send('I cannot manage this member.');
		}
	}
}