# Freeflix

Freeflix is a free movie streaming application with responsive design and subtitle support. Powered by TMDB API.

##### &ndash; Browse by genres
##### &ndash; Search
##### &ndash; Add movies to your collection to watch later
##### &ndash; English subtitles
##### &ndash; No leftover files
##### &ndash; Top 20 trending movies each week
##### &ndash; Choice between different releases

## What this app doesn't do?

The app doesn't support series at the moment.

## How to run

You need to have Node.js installed. You can download it from here https://nodejs.org/en/ 
Clone the repository or download as a .zip folder.
In the folder of the app open a terminal and run: 

### `npm install`

In the example.env file you only need to specify a Database URL. 
You can change the rest of the options however the app will run fine without them.
The default port is 3000!

After everyrhing is set again in the app folder open a terminal and run:

### `npm run serve`

This command will automatically build the app and open a window on your browser.

### Note! If you change the port from example.env you need to manually open the app in the port you set. The `serve` command is hardcoded to open a new tab on port 3000!

#### Note! Some movies may be silent. That is not the applications fault. Chrome and other browsers don't support all audio codecs.

#### If the app crashes for some reason just restart it. If you are a develpover you can open an issue and give informtion how to reproduce the crash/bug
