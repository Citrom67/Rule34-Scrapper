var Https = require('https');
var rl = require('readline-sync');
const fs = require('fs');
if (require.main === module) {
  Main();
}

function Main(){
    let raw = GetLinkWithDetails();
    Https.get(raw.split('|')[0], res => {
      let data = '';
      res.on('data', chunk => { data += chunk; }).on('end', () => { data = JSON.parse(data);
        for (var i = 0; i < data.length; i++) { downloadImage(data[i].file_url, raw.split('|').pop()); }
        console.log(`Images are downloaded!`);
      })
    })
  }

function GetLinkWithDetails(){
  let tags, limit, location;
  tags = rl.question("Enter tags [Default = None, (Works Best With One Or No Tags), For Multiple Tags Use ', ']:\n").split(',').join('+').replace(' ', '');;
  limit = parseInt(rl.question('How many images do you want to download: [Default = 100, Max = 1000]:\n'));
  location = rl.question('Where do you want them downlaoded [Default = Current folder]:\n');

  if (limit == NaN) { limit = 100; }
  if (limit > 1000) { limit = 1000; }
  if (location == '') { location = __dirname + "/downloads"; }
  if(!(fs.existsSync(location)) ){ fs.mkdir(location, (err) => {
        if (err) {
          location = __dirname + "/downloads";
          fs.mkdir(location);
        }
    });
  }
  return "https://r34-json-api.herokuapp.com/posts?tags=" + tags + "&limit=" + limit + "|" + location;
}

function downloadImage(url, filepath) {
    return new Promise((resolve, reject) => {
        Https.get(url, (res) => {
            if (res.statusCode === 200) {
              res.pipe(fs.createWriteStream(`${filepath}/${url.split('/').pop()}`).on('error', reject).once('close', () => resolve(filepath)));
            }
        });
    });
}
