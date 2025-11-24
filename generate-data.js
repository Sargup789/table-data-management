const fs = require('fs');

// Character names pool
const names = [
  'Naruto', 'Sasuke', 'Sakura', 'Kakashi', 'Hinata', 'Shikamaru', 'Ino', 'Choji',
  'Rock Lee', 'Neji', 'Tenten', 'Gaara', 'Temari', 'Kankuro', 'Jiraiya', 'Tsunade',
  'Orochimaru', 'Itachi', 'Kisame', 'Deidara', 'Sasori', 'Hidan', 'Kakuzu', 'Obito',
  'Madara', 'Hashirama', 'Tobirama', 'Minato', 'Kushina', 'Hiruzen', 'Danzo', 'Might Guy',
  'Asuma', 'Kurenai', 'Konohamaru', 'Iruka', 'Shino', 'Kiba', 'Akamaru', 'Yamato',
  'Sai', 'Killer Bee', 'A', 'Darui', 'Kurotsuchi', 'Akatsuchi', 'Onoki', 'Mei',
  'Chojuro', 'Ao', 'Zabuza', 'Haku', 'Kimimaro', 'Jugo', 'Suigetsu', 'Karin',
  'Kabuto', 'Anko', 'Ibiki', 'Shisui', 'Fugaku', 'Mikoto', 'Izuna', 'Indra',
  'Asura', 'Hagoromo', 'Hamura', 'Kaguya', 'Black Zetsu', 'White Zetsu', 'Pain', 'Konan',
  'Nagato', 'Yahiko', 'Hanzo', 'Chiyo', 'Ebizo', 'Rasa', 'Karura', 'Pakura',
  'Guren', 'Yugito', 'Yagura', 'Roshi', 'Han', 'Utakata', 'Fu', 'Matatabi',
  'Isobu', 'Son Goku', 'Kokuo', 'Saiken', 'Chomei', 'Gyuki', 'Kurama', 'Shukaku'
];

const locations = ['Konoha', 'Suna', 'Kiri', 'Iwa', 'Kumo'];
const healthStates = ['Healthy', 'Injured', 'Critical'];

function generateId() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

function getRandomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function getRandomPower() {
  return Math.floor(Math.random() * (10000 - 100 + 1)) + 100;
}

function generateData(count) {
  const data = [];
  
  // Add fixed test characters first for consistent testing
  const testCharacters = [
    { id: 'test-naruto', name: 'Naruto', location: 'Konoha', health: 'Healthy', power: 10000 },
    { id: 'test-sasuke', name: 'Sasuke', location: 'Konoha', health: 'Injured', power: 9500 },
    { id: 'test-gaara', name: 'Gaara', location: 'Suna', health: 'Critical', power: 8500 },
    { id: 'test-rocklee', name: 'Rock Lee', location: 'Konoha', health: 'Healthy', power: 50 },
    { id: 'test-killerbee', name: 'Killer Bee', location: 'Kumo', health: 'Healthy', power: 9000 },
  ];
  
  data.push(...testCharacters);
  
  // Names to exclude from random generation (test characters)
  const testNames = testCharacters.map(char => char.name);
  const availableNames = names.filter(name => !testNames.includes(name));
  
  // Generate remaining random characters
  let nameIndex = 0;
  for (let i = testCharacters.length; i < count; i++) {
    // Use available names cyclically
    let name = availableNames[nameIndex % availableNames.length];
    if (nameIndex >= availableNames.length) {
      const suffix = Math.floor(nameIndex / availableNames.length);
      name = `${name} ${suffix}`;
    }
    nameIndex++;
    
    data.push({
      id: generateId(),
      name: name || `Character ${i + 1}`,
      location: getRandomElement(locations),
      health: getRandomElement(healthStates),
      power: getRandomPower()
    });
  }
  
  return data;
}

// Generate 1500 entries to exceed the 1000+ requirement
const characters = generateData(1500);

const db = {
  characters: characters
};

fs.writeFileSync('db.json', JSON.stringify(db, null, 2));

console.log(`✅ Generated ${characters.length} character entries in db.json`);

