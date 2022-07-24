/**
 * This script file will (or atleast should) run before the main script file runs.
 * This file should contain stuff like options, global variables (etc.) to be used by the main script.
 * */

// Options

// URL options can override the options below.
// Options set through the menu can override both.
options = {
    username: 'Luna',
    avatar: 'https://cdn.discordapp.com/avatars/673952206663319563/cca7e5e9f94365b9facdc5318e260aa1.png',
    verified: true,
    noUser: false,
    dataSpecified: false,
    guiTabs: ['author', 'description'],
    useJsonEditor: false,
    reverseColumns: false,
    allowPlaceholders: false,
    autoUpdateURL: false,
    autoParams: false,
    hideEditor: false,
    hidePreview: false,
    hideMenu: false,
    multiEmbeds: false,
    noMultiEmbedsOption: true,
}

// Default JSON object

// json = {
//     content: "Hello world",
//     embed: {
//         title: "A title",
//         description: "A description",
//     }
// }


// Write any code under the 'DOMContentLoaded' event to run after the page has loaded.
addEventListener('DOMContentLoaded', () => {
    console.log('Hello 👋');
    console.log('Credit to Glitchii on github for the original script.');

    // Remove the colour picker
    // document.querySelector('.colors').remove()
})