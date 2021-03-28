# Freeflix

Freeflix is a free movie streaming application. Powered by TMDB API.

## What this app doesn't do?

The app doesn't support series and subtitles at the moment.

## How to run

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
