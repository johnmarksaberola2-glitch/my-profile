let firstname = "John Mark";
let lastname = "Saberola";
const imgsrc = "https://avatars.githubusercontent.com/u/240685117?s=400&u=ac8edd652276549c7c8adbdffa5dcab053f8049e&v=4";


document.getElementById("content").innerHTML = `
    <h1>My profile</h1>
    <p>My name is ${firstname} ${lastname}</p>
    <img src="${imgsrc}" alt="profile picture goes here">
`;