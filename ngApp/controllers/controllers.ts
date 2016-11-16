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
    export class DialogController {

    }
    export class TagsController {
      public newTag = {};
      public tagToDelete = {};
      public tags;
      /// DRY post and get callbacks
      public postTag(){
        this.appApiService.postTag(this.newTag).then((results)=>{
          this.tags = results.data;
          this.newTag = {};
        });
      }
      public getTags(){
        this.appApiService.getTag().then((results)=>{
          this.tags = results;
        });
      }
      public removeTag(tag){
        this.appApiService.removeTag({name: tag.name} ).then((results) =>{
          this.tags = results.data;
        });
      }
      public openDialog(tag){
          this.$mdDialog.show({
          controller: DialogController,
          templateUrl: 'dialog1.tmpl.html',
          clickOutsideToClose:true
        })
        .then(function(answer) {
          console.log('woohoo!');
        }, function() {
          console.log('weeoo!');
        });
      }
      public closeDialog(){

      }
      constructor(private appApiService: ngpoli.Services.appApiService,
      private $mdDialog: ng.material.IDialogService){
        this.getTags();
      }
    }

}
