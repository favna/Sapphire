import { ApplyOptions } from '@sapphire/decorators';
import type { CommandOptions } from '@sapphire/framework';
import { Message, MessageEmbed, TextChannel } from 'discord.js';
import SapphireCommand from '#lib/SapphireCommand';

@ApplyOptions<CommandOptions>({
	aliases: ['ld', 'lock'],
	category: 'Moderation',
	description: 'Locks down the channel',
	preconditions: ['OwnerOnly', 'AdminOnly']
})
export default class LockdownCommand extends SapphireCommand {
	public async run(message: Message) {
		const lockEmbed = new MessageEmbed();
		const channel = message.guild?.channels.cache.find((channel) => channel.id === message.channel.id) as TextChannel;
		const everyone = message.guild?.roles.everyone.id as string;
		const modlogsChannel = this.context.client.channels.cache.get('683163930344161310') as TextChannel;
		const prefix = await this.context.client.fetchPrefix(message);
		channel.overwritePermissions(
			[
				{
					id: everyone,
					allow: ['SEND_MESSAGES']
				}
			],
			'Lockdown'
		);
		// channel.overwritePermissions(message.guild?.id as string, {
		// 	SEND_MESSAGES: false
		// });
		lockEmbed
			.setColor(message.member?.displayHexColor as string)
			.setAuthor(message.author.tag, message.author.displayAvatarURL())
			.setDescription(
				`**Action:** 🔒 locked the \`${channel.name}\` channel.\n
            **Details:** Only staff can now access this channel. Use \`${prefix}unlock\` in this channel to unlock the channel`
			)
			.setTimestamp();

		if (message.deletable) {
			message.delete();
		}

		modlogsChannel.send(lockEmbed);
	}
}