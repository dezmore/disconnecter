import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { VoiceChannel } from "@shared/schema";

type VoiceChannelUserProps = {
  name: string;
};

const VoiceChannelUser = ({ name }: VoiceChannelUserProps) => {
  return (
    <div className="flex items-center py-1">
      <div className="w-2 h-2 bg-discord-success rounded-full mr-2"></div>
      <span>{name}</span>
    </div>
  );
};

type VoiceChannelItemProps = {
  channel: VoiceChannel;
};

const VoiceChannelItem = ({ channel }: VoiceChannelItemProps) => {
  return (
    <div className="py-3 border-b border-gray-700 last:border-b-0">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <i className="ri-volume-up-fill text-discord-light mr-2"></i>
          <span className="font-medium">{channel.name}</span>
        </div>
        <span className="text-sm text-discord-light">
          {channel.users.length} {channel.users.length === 1 ? "user" : "users"}
        </span>
      </div>
      
      <div className="mt-2 pl-6 text-sm text-discord-light">
        {channel.users.map((user, idx) => (
          <VoiceChannelUser key={idx} name={user.tag} />
        ))}
      </div>
    </div>
  );
};

type VoiceChannelsProps = {
  voiceChannels: VoiceChannel[];
};

export function VoiceChannels({ voiceChannels }: VoiceChannelsProps) {
  return (
    <Card className="bg-discord-secondary border-none rounded-lg overflow-hidden">
      <CardHeader className="px-6 py-5 border-b border-gray-700">
        <CardTitle className="font-medium text-base">Active Voice Channels</CardTitle>
      </CardHeader>
      
      <CardContent className="p-4">
        {voiceChannels.length === 0 ? (
          <div className="py-8 text-center text-discord-light">
            <p>No active voice channels</p>
          </div>
        ) : (
          voiceChannels.map((channel, idx) => (
            <VoiceChannelItem key={idx} channel={channel} />
          ))
        )}
      </CardContent>
    </Card>
  );
}
