const { Client, GatewayIntentBits, ActionRowBuilder, StringSelectMenuBuilder, PermissionsBitField } = require('discord.js');

// Mengambil token secara aman dari Environment Variables Railway
const DISCORD_TOKEN = process.env.DISCORD_TOKEN;

const client = new Client({ 
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] 
});

client.once('ready', () => {
    console.log(`🤖 Bot ${client.user.tag} online! Siap membuat sistem Take Role.`);
});

// Menangkap pesan untuk memunculkan menu dropdown
client.on('messageCreate', async (message) => {
    // Hanya Admin yang bisa memunculkan menu ini dengan mengetik !setuprole
    if (message.content === '!setuprole' && message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
        
        // --- DROPDOWN 1: JABATAN ---
        const jabatanMenu = new ActionRowBuilder().addComponents(
            new StringSelectMenuBuilder()
                .setCustomId('select_jabatan')
                .setPlaceholder('Pilih Jabatan Kamu...')
                .addOptions([
                    { label: 'CS', description: 'Customer Service', value: 'CS', emoji: '🎧' },
                    { label: 'Cashier', description: 'Staff Cashier', value: 'Cashier', emoji: '💰' },
                    { label: 'Senior Cashier', description: 'Senior Cashier', value: 'Senior Cashier', emoji: '💎' },
                    { label: 'Leader Cashier', description: 'Leader Cashier', value: 'Leader Cashier', emoji: '👑' },
                    { label: 'Finance', description: 'Tim Keuangan', value: 'Finance', emoji: '📊' },
                    { label: 'Lottery', description: 'Tim Lottery', value: 'Lottery', emoji: '🎰' },
                ]),
        );

        // --- DROPDOWN 2: TIM ---
        const timMenu = new ActionRowBuilder().addComponents(
            new StringSelectMenuBuilder()
                .setCustomId('select_tim')
                .setPlaceholder('Pilih Tim Kamu...')
                .addOptions([
                    { label: 'Team Soho', value: 'Team Soho' },
                    { label: 'Team Lima', value: 'Team Lima' },
                    { label: 'Team Retro & Yel', value: 'Team Retro & Yel' },
                    { label: 'Team Hugo & Fola', value: 'Team Hugo & Fola' },
                    { label: 'Team Xo & Senja', value: 'Team Xo & Senja' },
                    { label: 'Team Dodo & Axis', value: 'Team Dodo & Axis' },
                    { label: 'Team Rembo & Helen', value: 'Team Rembo & Helen' },
                    // Tambahkan sisa tim kamu di sini dengan format yang sama
                ]),
        );

        await message.channel.send({
            content: '### 🏢 SISTEM PENGAMBILAN ROLE DAY-GROUP\nSilakan pilih **Jabatan** dan **Tim** kamu dari menu di bawah ini. Akses channel akan terbuka otomatis setelah role dipilih.',
            components: [jabatanMenu, timMenu]
        });
        
        // Hapus pesan trigger (!setuprole) biar rapi
        await message.delete();
    }
});

// Menangkap interaksi saat user memilih dropdown
client.on('interactionCreate', async (interaction) => {
    if (!interaction.isStringSelectMenu()) return;

    const roleName = interaction.values[0];
    const role = interaction.guild.roles.cache.find(r => r.name.toLowerCase() === roleName.toLowerCase());

    if (!role) {
        return interaction.reply({ content: `❌ Role **${roleName}** tidak ditemukan di server. Lapor ke Admin!`, ephemeral: true });
    }

    const member = interaction.member;

    try {
        // Jika user sudah punya role tersebut, maka bot akan menghapusnya (Toggle)
        if (member.roles.cache.has(role.id)) {
            await member.roles.remove(role);
            await interaction.reply({ content: `➖ Role **${role.name}** telah dihapus dari profilmu.`, ephemeral: true });
        } else {
            // Jika belum punya, bot akan menambahkannya
            await member.roles.add(role);
            await interaction.reply({ content: `✅ Berhasil! Kamu sekarang memiliki role **${role.name}**.`, ephemeral: true });
        }
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: `❌ Terjadi kesalahan. Pastikan posisi role Bot berada paling atas di Server Settings!`, ephemeral: true });
    }
});

client.login(DISCORD_TOKEN);
