
import { SUBCLASSES } from './data/subclasses';

const sorcererSubclasses = SUBCLASSES.filter(s => s.class?.index === 'sorcerer');
console.log('Sorcerer Subclasses found:', sorcererSubclasses.length);
sorcererSubclasses.forEach(s => console.log(`- ${s.name} (${s.index})`));

if (sorcererSubclasses.length === 0) {
    console.log('No Sorcerer subclasses found!');
    console.log('Available class indices in SUBCLASSES:', Array.from(new Set(SUBCLASSES.map(s => s.class?.index))));
}
