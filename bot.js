const { Telegraf } = require('telegraf');
const axios = require('axios');
const cheerio = require('cheerio');

const bot = new Telegraf('7900848687:AAFmevC8ckURU2rNkmeP2U_P189Qj8BVnmM');
const videoDatabase = {}; // Kodni saqlash uchun obyekt

bot.start((ctx) => ctx.reply('Assalomu alaykum! Video kodni yozing'));

bot.command('setcode', (ctx) => {
    const args = ctx.message.text.split(' ');
    if (args.length < 3) {
        return ctx.reply('Foydalanish:kod aniq bolishi kerak');
    }

    const videoUrl = args[1];
    const videoCode = args[2];

    videoDatabase[videoCode] = videoUrl;
    ctx.reply(`Kod muvaffaqiyatli saqlandi: ${videoCode} -> ${videoUrl}`);
});

bot.on('text', async (ctx) => {
    const videoCode = ctx.message.text.trim();
    
    if (videoDatabase[videoCode]) {
        return ctx.reply(`Siz izlagan video: ${videoDatabase[videoCode]}`);
    }
    
    try {
        const searchUrl = `https://example.com/search?q=${videoCode}`;
        const { data } = await axios.get(searchUrl);
        const $ = cheerio.load(data);
        
        const movieLink = $('a.movie-link').attr('href');
        
        if (movieLink) {
            ctx.reply(`Siz izlagan video: ${movieLink}`);
        } else {
            ctx.reply('Kechirasiz, video topilmadi.');
        }
    } catch (error) {
        ctx.reply('Xatolik yuz berdi, keyinroq qayta urinib ko‘ring.');
    }
});

bot.launch();
console.log('Bot ishga tushdi!');
