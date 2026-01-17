
export interface BotConfig {
  token: string;
  welcomeMessage: string;
  imageUrl: string;
  buttonText: string;
  buttonUrl: string;
}

export enum BotLibrary {
  Grammy = 'grammy',
  NodeTelegramBotApi = 'node-telegram-bot-api'
}
