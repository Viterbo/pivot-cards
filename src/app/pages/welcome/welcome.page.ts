import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Component({
    selector: 'welcome-page',
    templateUrl: 'welcome.page.html',
    styleUrls: ['welcome.page.scss'],
})
export class WelcomePage {
    images = [944, 1011, 984].map((n) => `https://picsum.photos/id/${n}/900/500`);
    // images = [1, 2, 3, 4].map((n) => `https://ionicframework.com/docs/demos/api/slides/slide-${n}.png`);

    constructor(
        public router: Router,
        public cookies: CookieService
    ) {
        if (this.cookies.get("skip-welcome") == "yes") {
            console.log("skipping-welcome...");
            this.router.navigate(["/home"]);
        }
        // console.error("Saqué esto momentáneamente para el video");
    }

    enter() {
        this.router.navigate(["/home"]);
        this.cookies.set("skip-welcome", "yes")
    }

}
