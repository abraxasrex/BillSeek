export class DialogController {
  public postLabel = this.postLabel;
  constructor(private $scope: ng.IScope, private $mdDialog: ng.material.IDialogService){}
}

export class TagsController {
  public newLabel = {};
  public editLabel = {};
  public labelToDelete = {};
  public labels;
  constructor(private appApiService: ngpoli.Services.appApiService,
    private $mdDialog: ng.material.IDialogService,
    private $scope: ng.IScope){
    this.getLabels();
  }
  public postLabel(label){
    this.appApiService.postLabel(label).then((results)=>{
      this.labels = results.data;
      this.newLabel = {};
    });
  }
  public getLabels(){
    this.appApiService.getLabels().then((results)=>{
      this.labels = results;
    });
  }
  public removeLabel(label){
    this.appApiService.removeLabel(label).then((results) =>{
      this.labels = results.data;
    });
  }
  public openDialog(label){
    let vm = this.$scope;
    this.editLabel = label;
      this.$mdDialog.show({
        scope: vm,
        preserveScope: true,
      controller: DialogController,
      templateUrl: 'dialog1.tmpl.html',
      clickOutsideToClose:true
    })
    .then(()=> {
      this.postLabel(this.editLabel);
    }, ()=> {
      this.editLabel = {};
    });
  }
  public cancelEdit(){
    this.$mdDialog.cancel();
  }
  public submitEdit(){
    this.$mdDialog.hide();
  }

  // from homeController VVV (?)
  
  // public openDialog(){
  //   let vm = this.$scope;
  //     this.$mdDialog.show({
  //       scope: vm,
  //       preserveScope: true,
  //       controller: HomeDialog,
  //       templateUrl: 'dialog2.tmpl.html',
  //       clickOutsideToClose:false
  //   }).then(()=> { this.list(); }, ()=> { /*cancel modal */ });
  // }

}
