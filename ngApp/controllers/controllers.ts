namespace ngpoli.Controllers {
    let targetUrl = 'https://www.govtrack.us/api/v2/role?current=true';
    export class HomeController {
        public message = 'Hello from the home page!';
    }

    export class BillsController {
        public message = 'Hello from the about page!';
        public bills;
        public getBills(){
          this.govTrackService.get().then((results)=>{
            console.log('result objects: ', results.objects.length);
            this.bills = results.objects;
          });
          console.log('bills: ', this.bills);
        }
        constructor(private govTrackService: ngpoli.Services.govTrackService){
          this.getBills();
        }
    }

    export class TagsController {
      public newTag = {};
      public tags;
      /// DRY post and get callbacks
      public postTag(){
        console.log('newTag: ', this.newTag);
        this.appApiService.postTag(this.newTag).then((results)=>{
          console.log('result tags: ', results);
          this.tags = results.data;
        });
        console.log('tags: ', this.tags);
      }
      public getTags(){
        this.appApiService.getTag().then((results)=>{
          console.log('result tags: ', results);
          this.tags = results;
        });
        console.log('tags: ', this.tags);
      }
      constructor(private appApiService: ngpoli.Services.appApiService){
        this.getTags();
      }
    }

}
