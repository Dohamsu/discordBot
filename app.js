
require("dotenv").config();


const fs            = require("fs");  //파일 시스템 접근 라이브러리
const { REST }      = require("@discordjs/rest"); //for REST API 
const { Routes }     = require("discord-api-types/v9");
const API_CONNECTOR = require('./js/APIconnector');
const { Client, Intents, Collection } = require('discord.js');
const { file } = require("tmp");

//메시지 캐치에 필요한 client, guilds 객체 선언
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

const commandFiles = fs.readdirSync("./commands").filter(file => file.endsWith(".js"));

const commands = new Collection();


for (const file of commandFiles){
    const command = require(`./commands/${file}`);
    commands.push(command.data.toJSON());
    client.commands.set(command.data.name, command);

}





//최초 한번만 실해오디는 코드
client.once('ready', () => {
    console.log("###################################");
    console.log(`${client.user.tag} 로그인 완료`);
    console.log("###################################");

    const CLIENT_ID = client.user.id;

    const rest = new REST({
        version: "9"
    }).setToken(process.env.TOKEN);

    (async () => {
        try {
            if(process.env.ENV ==="production"){
                await rest.put(Routes.applicationCommand(CLIENT_ID), {
                    body: commands
                });
                console.log("명령어 입력 완료");
            }else{
                await rest.put(Routes.applicationCommand(CLIENT_ID), {
                    body: commands
                });
                console.log("명령어 입력 완료");

            }
        } catch (error) {
            
        }
    })


});

client.on('message', msg => {
  if (msg.content === 'ping') {
    msg.reply('Pong!');
  }
});

//봇 로그인 
client.login(process.env.TOKEN);