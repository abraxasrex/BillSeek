namespace ngpoli.Controllers {
    let targetUrl = 'https://www.govtrack.us/api/v2/role?current=true';
    export class HomeController {
        public message = 'Hello from the home page!';
    }

    export class AboutController {
        public message = 'Hello from the about page!';
        public bills = [
          '1253',
          '554',
          '2872'
        ];
        public person;
        public people;
        constructor(private SuperService: ngpoli.Services.SuperService,
        private $http: ng.IHttpService,
        private govTrackService: ngpoli.Services.govTrackService){
          SuperService.saySuper();
            this.people = govTrackService.govTrackFetch();
        }
        public printPerson (){
          console.log('person: ', this.people);
        }
    }

}
