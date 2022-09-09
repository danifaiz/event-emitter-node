const og = require('open-graph');
var EventEmitter = require('events');

class TinyScraper extends EventEmitter {

    constructor(webpageUrl, timeout = 2000) {
      super();
      this.webpageUrl = webpageUrl;
      this.timeoutInterval = timeout; // ms
      this.validUrls = ['url1', 'url2']
      this.startScrapping();
    }
    
    startScrapping() {
      this.emitEvents('scrapeStarted', this.webpageUrl)
      const urlName = this.webpageUrl.substring(this.webpageUrl.lastIndexOf('/') + 1)
      if(!this.validUrls.includes(urlName)) {
        this.emitEvents('error', '');
        return;
      }
      this.runScrapping();
    }

    async runScrapping() {
     const scrapper = new Promise((resolve, reject) => {
        og(this.webpageUrl, (error, meta) => {
             if(error){
               return reject(error);
             }
             return resolve(meta);
        });
        setTimeout(()=>{
          reject('timeout');
        }, this.timeoutInterval);
     })
      scrapper.then((meta)=> {
        this.emit('scrapeSuccess', { title: meta.title, description: meta.description, image: meta.image.url});
      }).catch((error)=>{
        console.log(error)
        if(error =='timeout') {
          this.emit('timeout', '');
        }
      })
    }

    emitEvents(eventName, data) {
      setTimeout(()=>{
        this.emit(eventName, data);
      },0)
    }
}

module.exports = TinyScraper; 