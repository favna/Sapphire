import { ApplyOptions } from '@sapphire/decorators';
import type { CommandOptions, Args } from '@sapphire/framework';
import { Message, MessageEmbed, TextChannel } from 'discord.js';
import SapphireCommand from '#lib/SapphireCommand';

@ApplyOptions<CommandOptions>({
	aliases: ['nick', 'n'],
	category: 'Moderation',
	description: 'Nicknames the selected member with the provided nickname',
	preconditions: ['OwnerOnly', 'AdminOnly']
})
export default class NicknameCommand extends SapphireCommand {
	public async run(message: Message, args: Args) {
		const user = await args.pick('user');
		if (!user) throw '**User not provided.** Users can be either an id or mention.';
		const nickname = await args.rest('string');
		if (nickname && nickname.length > 1000) throw 'Reason maximum char length is 1000.';
		const member = await message.guild!.members.fetch(user?.id).catch(() => null);
		if (!member) throw '**Member not found.** Please make sure the user is in this guild.';
		const modlogsChannel = this.context.client.channels.cache.get('683163930344161310') as TextChannel;
		const oldName = member.displayName;
		const nicknameEmbed = new MessageEmbed();
		member.setNickname(nickname);

		nicknameEmbed.setColor(member.displayHexColor).setDescription(`**Action:** Nickname change\n
        **Member:** <@${member.id}> (${member.user.tag})\n
        **Old name:** ${oldName}\n
        **New name:** ${nickname}\n`);

		if (message.deletable) {
			message.delete();
		}

		modlogsChannel.send(nicknameEmbed);
	}
}