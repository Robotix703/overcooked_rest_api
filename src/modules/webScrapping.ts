import axios from 'axios';
import cheerio from 'cheerio';

export async function fetchData(url: string) {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    const durationDiv = $('p.RCP__sc-1qnswg8-1').text();
    const duration = durationDiv.match(/\d+/)?.[0];

    const numberOfLunchDiv = $('span.SHRD__sc-w4kph7-4').text();
    const numberOfLunch = numberOfLunchDiv.match(/\d+/)?.[0];

    const titleDiv = $('h1.SHRD__sc-10plygc-0').text();

    const imageDiv = $('img.SHRD__sc-dy77ha-0').attr('data-src');

    return {
        duration: duration,
        numberOfLunch: numberOfLunch,
        title: titleDiv,
        imageSRC: imageDiv
    }
}