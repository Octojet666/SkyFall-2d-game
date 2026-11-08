export const NPCS = {
  elder_maren: {
    id: 'elder_maren',
    name: 'Elder Maren',
    kind: 'quest',
    region: 'ash',
    x: 18 * 16,
    y: 0,
    color: '#7a5ab0',
    dark: '#4a3278',
    dialogue: {
      greetings: [
        'Welcome to Ashenfall, traveler. The forest has grown bold.',
        'I sense a restless wind in the trees. Something stirs.',
        'You carry yourself like one who has seen the road.',
      ],
      main: [
        'Goblins have nested east of here. They raid the grazing grounds.',
        'I need someone with a steady hand to thin their numbers.',
        'Bring me proof of three slain. I will see you rewarded.',
        'The forest remembers blood. Do not linger after dark.',
      ],
      complete: [
        'You have done Ashenfall a great service. Take this gold and these honors.',
        'The village sleeps safer because of you.',
        'Come again when the roads stir.',
      ],
      default: [
        'The road is long. Rest if you can.',
        'Keep your blade close and your eyes closer.',
        'Ashenfall is quiet for now. Enjoy it.',
      ],
    },
    quest: 'goblin_clearing',
  },
  brann_smith: {
    id: 'brann_smith',
    name: 'Brann the Smith',
    kind: 'shop',
    region: 'ash',
    x: 32 * 16,
    y: 0,
    color: '#c98a2b',
    dark: '#7a5216',
    dialogue: {
      greetings: [
        'Brann\'s forge is open. What do you need?',
        'Steel waits for no one, but it can wait a moment for coin.',
        'If it can be hammered, I can help.',
      ],
      sell: [
        'A fair price for honest work. I can use that.',
        'Good. I\'ll put that toward better iron.',
        'Small change, but it adds up.',
      ],
      buy: [
        'Take care of your gear. A dull blade is a dead one.',
        'Good steel. Treat it well.',
        'You look after your tools, I look after you.',
      ],
      complete: [
        'Keep your edge. I\'ll keep the fire lit.',
      ],
    },
    shop: 'blacksmith',
  },
  itinerantmerchant: {
    id: 'itinerantmerchant',
    name: 'Vessa the Wanderer',
    kind: 'shop',
    region: 'forest',
    x: 90 * 16,
    y: 0,
    color: '#9ac83a',
    dark: '#5a7a1a',
    dialogue: {
      greetings: [
        'Traveling sells, and so do I.',
        'I carry what the road has taught me to value.',
        'A purse light? I still have use for you.',
      ],
      sell: [
        'A trade is a trade. Thank you.',
        'The road pays well when it can.',
        'A fair exchange beats a long argument.',
      ],
      buy: [
        'Something to keep you on the road.',
        'Take what you need and move on.',
        'Useful things for useful people.',
      ],
      complete: [
        'Safe roads. Or at least safer.',
      ],
    },
    shop: 'general',
  },
  potion_merchant: {
    id: 'potion_merchant',
    name: 'One-Eyed Nera',
    kind: 'shop',
    region: 'frost',
    x: 150 * 16,
    y: 0,
    color: '#5ab0d8',
    dark: '#2a6a8a',
    dialogue: {
      greetings: [
        'The cold steals warmth. I sell remedies.',
        'A frosty welcome, and a warm bottle.',
        'Drink before you regret not drinking.',
      ],
      sell: [
        'A little gold, a little relief. Fine trade.',
        'I\'ll take that. Don\'t spend it all on tea.',
        'Good. Keep your strength.',
      ],
      buy: [
        'Heating the blood. Worth the coin.',
        'Take a few. The mountain is unforgiving.',
        'Better to have it and not need it.',
      ],
      complete: [
        'Stay warm, stay alive.',
      ],
    },
    shop: 'potions',
  },
  runekeeper: {
    id: 'runekeeper',
    name: 'Runekeeper Sol',
    kind: 'quest',
    region: 'ruin',
    x: 200 * 16,
    y: 0,
    color: '#6a5ac8',
    dark: '#3a2a7a',
    dialogue: {
      greetings: [
        'Another soul in the ruins. Rare, and usually brief.',
        'These stones remember more than we do.',
        'You walk where kings once stood. Tread thoughtfully.',
      ],
      main: [
        'The Underdark leaks shadow into these stones. Something ancient stirs below.',
        'While I now remember more than we do, perhaps you can help me investigate the descent.',
        'Bring me proof that the path is still alive, and I will share what knowledge survives.',
        'Do not touch the black glass. It bites.',
      ],
      complete: [
        'You have a brave heart and a curious mind. Both are useful.',
        'Take this. Knowledge should be rewarded.',
        'The ruins will speak again when the world is ready.',
      ],
      default: [
        'Stay away from the dark stair.',
        'I read the old stones. They are not kind.',
        'Curiosity is a gift and a curse.',
      ],
    },
    quest: 'ruin_investigation',
  },
  forge_warden: {
    id: 'forge_warden',
    name: 'Warden Kael',
    kind: 'quest',
    region: 'blackthorn',
    x: 256 * 16,
    y: 0,
    color: '#c83838',
    dark: '#7a1a1a',
    dialogue: {
      greetings: [
        'So another fool walks into the keep.',
        'Few leave. Fewer come back with their wits.',
        'If you came to gawk, turn back. If you came to fight, draw.',
      ],
      main: [
        'The Warlord holds the keep\'s heart. Until he falls, the realm stays in shadow.',
        'Slay the Warlord and the way north opens for good.',
        'I will hold the gate. You bring me his token.',
      ],
      complete: [
        'His token. Good. The keep breathes again.',
        'You have my thanks and my steel.',
        'The north road is yours.',
      ],
      default: [
        'The keep eats the careless.',
        'Steel or death. Your choice.',
        'Don\'t die on my threshold.',
      ],
    },
    quest: 'blackthorn_warlord',
  },
};
export function npcById(id) {
  return NPCS[id] || null;
}
export function npcsInRegion(regionId) {
  return Object.values(NPCS).filter((n) => n.region === regionId);
}
export function npcAt(x, y, radius = 26 * 16) {
  for (const n of Object.values(NPCS)) {
    if (Math.abs(n.x - x) < radius && Math.abs(n.y - 0) < radius) return n;
  }
  return null;
}
