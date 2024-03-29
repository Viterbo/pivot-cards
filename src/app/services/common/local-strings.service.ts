import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { LocalList, Locals, LocalString } from './datatypes.service';
import { HttpClient } from '@angular/common/http';
import { Subject, Subscriber } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

declare var navigator:any;

export interface StringMap {[key:string]: string};

@Injectable()
export class LocalStringsService  {
    public string: LocalString;
    list:LocalList;
    locals:Locals;
    localKey:string;
    public onLocalChange:Subject<string> = new Subject();

    constructor(
        private http: HttpClient,
        public cookie: CookieService
    ) {
        this.string = {};
        this.locals = {};
        this.list = [];

        let userLang = navigator.language || navigator.userLanguage;
        let cached = this.cookie.get("locals");
        this.localKey = null;
        let localKey = "";
        if (cached) {
            localKey = cached;
        } else {
            switch (userLang.substr(0,2)) {
                case "en":
                    localKey = "en_US";
                    break;
                default:
                    localKey = "es_ES";
            }    
        }


        // ESPAÑOL ----------------------
        localKey = "es_ES";
        this.fetchLocalsList();
        this.setLocal(localKey);
    }

    
    fetchLocalsList() {
        return this.http.get<LocalList>("assets/locals/list.json").subscribe((response) => {
            this.list = response;
        });
    }

    async fetchLocals(localKey:string) {
        return this.http.get<any>("assets/locals/" + localKey + ".json").toPromise().then((response) => {
            this.string = response;
            this.locals[this.localKey] = this.string;
        });
    }

    async setLocal(localKey:string) {
        if (this.localKey != localKey) {
            this.localKey = localKey;
            this.cookie.set("locals", this.localKey);
            return this.fetchLocals(this.localKey).then(_ => {
                this.onLocalChange.next(this.localKey);
                return this.localKey;
            });
        }
    }

    merge(template:string, data:StringMap) {
        if(!template) return "";
        if(!data) return template;
        var str = template;
        for (var prop in data) {
            var key = "{{" + prop + "}}";
            str = str.split(key).join(data[prop]);
        }
        return str;
    }

}