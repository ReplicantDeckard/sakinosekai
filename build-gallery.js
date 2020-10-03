// WARNING: this will write over '_includes/_video-gallery.html'

const fs = require('fs');
const path = require('path');

const videoIDFile = fs.readFileSync(path.resolve("tools/video-ids.json"), "utf8");
const videoIDs = JSON.parse(videoIDFile);
let htm = "";

// video-ids are in newest-to-oldest order
// videoIDs.reverse();

videoIDs.forEach((id) => {
    htm += `<li><a href="https://www.youtube.com/watch?v=${id}" target="_blank"><img src="https://img.youtube.com/vi/${id}/hqdefault.jpg" alt="thumbnail of video ${id}" loading="lazy" decoding="async"></a></li>`;
});

fs.writeFileSync(path.resolve("_includes/_video-gallery.html"), htm, "utf8");

console.log("gallery built in _includes/_video-gallery.html");