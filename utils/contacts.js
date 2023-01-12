// // panggil core module file system
const fs = require('fs');

//folder pembuatan data secara otomatis jika belum tersedia
const dirPATH = './desktop';
if(!fs.existsSync(dirPATH)){
    fs.mkdirSync(dirPATH);
}

const dataPath = './desktop/contacts.json';
if (!fs.existsSync(dataPath)){
    fs.writeFileSync(dataPath, '[]', 'utf-8');
}

const load = () => {
    const fileBuffer = fs.readFileSync('desktop/contacts.json', 'utf-8');
    const contacts = JSON.parse(fileBuffer);
    return contacts;
}
const findC = (nama) => {
 const contacts = load()
 const contact = contacts.find((contact) => 
  contact.nama.toLowerCase() === nama.toLowerCase())
  return contact  
}

//menulis data / menimpa file contacts.json data baru
const saveC = (contacts) => {
    fs.writeFileSync('desktop/contacts.json', JSON.stringify(contacts))
}
//menambah data contact baru
const addC = (contact) => {
    const contacts = load()
    contacts.push(contact)
    saveC(contacts)
}

const cekD = (nama) =>{
    const contacts = load()
    return contacts.find((contact) => contact.nama === nama)
}
const delC= (nama) =>{
    const contacts = load()
    const filterC = contacts.filter((contact) => 
        contact.nama !== nama
    )
    saveC(filterC)

    
}

const upC = (contactNew)=>{
    const contacts = load()
    const filterC = contacts.filter((contact)=> contact.nama !== contactNew.namaLama)
    delete contactNew.namaLama
    filterC.push(contactNew)
    saveC(filterC)

}   
module.exports = { load , findC, addC, cekD, delC, upC}