namespace ngpoli.Controllers {
    let targetUrl = 'https://www.govtrack.us/api/v2/role?current=true';
    export class HomeController {
        public message = 'Hello from the home page!';
    }

    export class BillsController {
        public message = 'Hello from the about page!';
        public bills;
        public billService;
        public getBills(){
          this.billService.govTrackFetch().get((results)=>{
            console.log('result objects: ', results.objects.length);
            this.bills = results.objects;
          });
          console.log('bills: ', this.bills);
        }
        constructor(private govTrackService: ngpoli.Services.govTrackService){
          this.billService = govTrackService;
          this.getBills();
        }
    }

    export class TagsController {
      public newTag;
      public tags = [
        {name: 'military'},
        {name: 'bank'},
        {name: 'women'}
      ];
      public tagService;

      public postTag (){
        this.tagService.postTags().post((results)=>{
          console.log('result tags: ', results);
          this.tags = results;
        });
        console.log('tags: ', this.tags);
      }
      public getTags (){
        this.tagService.fetchTags().get((results)=>{
          console.log('result tags: ', results);
          this.tags = results;
        });
        console.log('tags: ', this.tags);
      }
      constructor(private appApiService: ngpoli.Services.appApiService){
        this.tagService = appApiService;
      }
    }

}
