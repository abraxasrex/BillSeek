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
            this.bills = results.objects;
          });
        }
        constructor(private govTrackService: ngpoli.Services.govTrackService){
          this.getBills();
        }
    }
    export class DialogController {
      public postTag = this.postTag;
      constructor(private $scope: ng.IScope, private $mdDialog: ng.material.IDialogService){}
    }

    export class TagsController {
      public newTag = {};
      public editTag = {};
      public tagToDelete = {};
      public tags;
      public postTag(tag){
        this.appApiService.postTag(tag).then((results)=>{
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
        this.appApiService.removeTag({_id: tag._id} ).then((results) =>{
          this.tags = results.data;
        });
      }
      public openDialog(tag){
        let vm = this.$scope;
        this.editTag = tag;
          this.$mdDialog.show({
            scope: vm,
            preserveScope: true,
          controller: DialogController,
          templateUrl: 'dialog1.tmpl.html',
          clickOutsideToClose:true
        })
        .then(()=> {
          this.postTag(this.editTag);
        }, ()=> {
          this.editTag = {};
        });
      }

      public cancelEdit(){
        this.$mdDialog.cancel();
      }
      public submitEdit(){
        this.$mdDialog.hide();
      }
      constructor(private appApiService: ngpoli.Services.appApiService,
        private $mdDialog: ng.material.IDialogService,
        private $scope: ng.IScope){
        this.getTags();
      }
    }
}
