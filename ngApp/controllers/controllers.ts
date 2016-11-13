namespace ngpoli.Controllers {
    let targetUrl = 'https://www.govtrack.us/api/v2/role?current=true';
    export class HomeController {
        public message = 'Hello from the home page!';
    }

    export class AboutController {
        public message = 'Hello from the about page!';
        public bills;
        public getBills(){
          
        }
        constructor(private govTrackService: ngpoli.Services.govTrackService){
            govTrackService.govTrackFetch().get((results)=>{
              console.log('result objects: ', results.objects.length);
              this.bills = results.objects;
            });
            console.log('bills: ', this.bills);
        }
    }

}
