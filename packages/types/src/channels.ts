// Channel Adapter Interfaces
// These define the contracts for integrating messaging platforms

// ============ Channel Adapter Base ============

export interface ChannelAdapter {
  type: ChannelType;
  start(): Promise<void>;
  stop(): Promise<void>;
  send(message: OutgoingMessage): Promise<void>;
  onMessage(callback: (message: IncomingMessage) => void): void;
  isConnected(): boolean;
}

export type ChannelType = 'whatsapp' | 'telegram' | 'discord' | 'web';

// ============ Incoming Messages ============

export interface IncomingMessage {
  id: string;
  channel: ChannelType;
  channelId: string; // channel-specific user ID
  threadId?: string; // for group chats
  content: string;
  metadata: ChannelMessageMetadata;
  timestamp: Date;
}

export interface ChannelMessageMetadata {
  // WhatsApp metadata
  whatsapp?: {
    from: string;
    to: string;
    messageId: string;
    participant?: string; // for group chats
  };
  
  // Telegram metadata
  telegram?: {
    messageId: number;
    chatId: number;
    userId?: number;
    username?: string;
    firstName?: string;
    lastName?: string;
  };

  // Discord metadata
  discord?: {
    guildId?: string;
    channelId: string;
    userId: string;
    username: string;
    discriminator: string;
  };

  // Web metadata
  web?: {
    sessionId: string;
    userAgent?: string;
    ipAddress?: string;
  };
}

// ============ Outgoing Messages ============

export interface OutgoingMessage {
  channel: ChannelType;
  channelId: string;
  threadId?: string;
  content: string;
  format?: 'text' | 'markdown' | 'html';
  options?: ChannelMessageOptions;
}

export interface ChannelMessageOptions {
  // Telegram options
  telegram?: {
    parseMode?: 'Markdown' | 'HTML';
    replyMarkup?: TelegramReplyMarkup;
    silent?: boolean;
  };

  // WhatsApp options
  whatsapp?: {
    previewUrl?: boolean;
  };

  // Discord options
  discord?: {
    embeds?: DiscordEmbed[];
    components?: DiscordComponent[];
  };

  // Web options
  web?: {
    typing?: boolean; // show typing indicator
  };
}

// ============ Telegram Types ============

export interface TelegramReplyMarkup {
  inlineKeyboard?: TelegramInlineKeyboard[][];
  replyKeyboard?: TelegramKeyboard[][];
  oneTimeKeyboard?: boolean;
  resizeKeyboard?: boolean;
}

export interface TelegramInlineKeyboard {
  text: string;
  callbackData?: string;
  url?: string;
  switchInlineQuery?: string;
}

export interface TelegramKeyboard {
  text: string;
  requestContact?: boolean;
  requestLocation?: boolean;
}

// ============ Discord Types ============

export interface DiscordEmbed {
  title?: string;
  description?: string;
  url?: string;
  color?: number;
  fields?: DiscordEmbedField[];
  thumbnail?: DiscordEmbedMedia;
  image?: DiscordEmbedMedia;
  footer?: DiscordEmbedFooter;
  timestamp?: Date;
}

export interface DiscordEmbedField {
  name: string;
  value: string;
  inline?: boolean;
}

export interface DiscordEmbedMedia {
  url?: string;
  proxyUrl?: string;
}

export interface DiscordEmbedFooter {
  text: string;
  iconUrl?: string;
}

export interface DiscordComponent {
  type: 'action_row';
  components: DiscordComponentItem[];
}

export interface DiscordComponentItem {
  type: 'button' | 'select_menu';
  label?: string;
  customId?: string;
  style?: 'primary' | 'secondary' | 'success' | 'danger' | 'link';
  url?: string;
  options?: DiscordSelectOption[];
}

export interface DiscordSelectOption {
  label: string;
  value: string;
  description?: string;
  emoji?: string;
}

// ============ Channel Config ============

export interface ChannelConfig {
  type: ChannelType;
  enabled: boolean;
  credentials: Record<string, string>;
  settings?: Record<string, unknown>;
}

// Telegram config
export interface TelegramConfig extends ChannelConfig {
  type: 'telegram';
  credentials: {
    botToken: string;
  };
  settings?: {
    webhooks?: boolean;
    webhookUrl?: string;
  };
}

// WhatsApp config
export interface WhatsAppConfig extends ChannelConfig {
  type: 'whatsapp';
  credentials: {
    sessionId: string;
  };
  settings?: {
    qrCodeCallback?: string;
    webhookUrl?: string;
  };
}

// Discord config
export interface DiscordConfig extends ChannelConfig {
  type: 'discord';
  credentials: {
    botToken: string;
    clientId: string;
  };
  settings?: {
    intents?: string[];
    guildId?: string;
  };
}
