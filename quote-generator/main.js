const quoteList = [
    "Albert Einstein*I have no special talent. I am only passionately curious.",
    "William Shakespeare*Wisely, and slow. They stumble that run fast.",
    "Mother Teresa*If you judge people, you have no time to love them.",
    "Buddha*All that we are is the result of what we have thought.",
    "Plato*The greatest wealth is to live content with little.",
    "Dalai Lama*Be kind whenever possible. It is always possible.",
    "Buddha*The root of suffering is attachment.",
    "Nelson Mandela*It always seems impossible until it’s done.",
    "Victor Hugo*Life is a flower of which love is the honey.",
    "Bob Marley*Love the life you live. Live the life you love.",
    "Benjamin Franklin*God helps those that help themselves.",
];

console.log(quoteList.length);
let button = document.querySelector('button');
let quote = document.querySelector('.quote');
let author = document.querySelector('.author');

function getRandomIndex(x){
    return (Math.floor(x * Math.random()));
}

button.onclick = () => {
    let randomIndex = getRandomIndex(quoteList.length);

    content = quoteList[randomIndex];

    // Set the author
    author.innerHTML = content.slice(0,content.indexOf('*'));
    // Set the quote
    quote.innerHTML = content.slice(content.indexOf('*')+1, content.length);


};