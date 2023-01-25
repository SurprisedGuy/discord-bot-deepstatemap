require('dotenv').config()
const axios = require('axios').default;
const { Client, Intents, EmbedBuilder } = require('discord.js');


class Deepstatemap {
    constructor() {
        this.botToken = process.env.DISCORD_BOT_TOKEN
        this.channelId = process.env.CHANNEL_ID
        this.info;
        this.discordClient = new Client({
            intents: [32767]
        })
    }

    async sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async getInfo() {
        let response = await axios({
            url: 'https://deepstatemap.live/api/history/public',
            method: 'GET',
            headers: {
                'accept': 'application/json, text/javascript, */*; q=0.01',
                'accept-encoding': 'gzip, deflate, br',
                'accept-language': 'ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7',
                'referer': 'https://deepstatemap.live/en',
                'sec-ch-ua': '"Not?A_Brand";v="8", "Chromium";v="108", "Google Chrome";v="108"',
                'sec-ch-ua-mobile': '?0',
                'sec-ch-ua-platform': '"Windows"',
                'sec-fetch-dest': 'empty',
                'sec-fetch-mode': 'cors',
                'sec-fetch-site': 'same-origin',
                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36',
            },
            responseType: 'json',
        })
        let lastInfo = response.data.length
        return response.data[lastInfo - 1]
    }

    async sendInfoToChannel() {
        const channel = await this.discordClient.channels.fetch(this.channelId)

        const exampleEmbed = new EmbedBuilder()
        .setColor('#242424')
        .setTitle('Обновленная информация:')
        .setURL('https://deepstatemap.live/en')
        .setAuthor({ name: 'Deppstatemap | Monitor', iconURL: 'https://www.sovsekretno.ru/upload/resize_cache/iblock/d51/4e4mtrqjuihz3zp4pm85zma2hqtgpaji/400_400_1/Logo_of_the_Wagner_Group.svg.png', url: 'https://github.com/SurprisedGuy/discord-bot-deepstatemap'})
        .setDescription('```' + this.info.descriptionEn + '```')
        .setThumbnail('https://yt3.googleusercontent.com/GnVlfkt8BeeEQdxffJQRzqr9FB9RKSTg5SZM_f6DmpQWP6n8Tlq2KUpgwlucR5xrdsw-Lp_12HE=s900-c-k-c0x00ffffff-no-rj')
        .setFooter({ text: `Информация обновлена | ${this.info.datetime}`, iconURL: 'https://www.sovsekretno.ru/upload/resize_cache/iblock/d51/4e4mtrqjuihz3zp4pm85zma2hqtgpaji/400_400_1/Logo_of_the_Wagner_Group.svg.png' });

        await channel.send({ embeds: [exampleEmbed] })
    }

    async boot() {
        this.discordClient.login(this.botToken)
        this.discordClient.once('ready', async () => {
            let oldInfo;
            console.log('Online')
            while(true) {
                this.info = await this.getInfo()
                this.info.descriptionEn = this.info.descriptionEn.replace(/<\/?[^>]+(>|$)/g, "")
                if (this.info.descriptionEn != oldInfo) {
                    await this.sendInfoToChannel()
                    oldInfo = this.info.descriptionEn
                }
                console.log('Point')
                await this.sleep(900000)
                console.log(this.info.descriptionEn)
                console.log(oldInfo)
            }
        })
    }
}


const bot = new Deepstatemap()
bot.boot()
