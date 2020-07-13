import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class DeckService {
    
    private setLoaded: Function;
    public waitLoaded = new Promise(resolve => {
        this.setLoaded = resolve;
    });

    public onSelected:Subject<any> = new Subject();
    
    constructor(
        public http: HttpClient,
    ) {
        this.http.get("assets/json/cards.json").subscribe(
            (value) => { console.log("complete", value)},
            (value) => { console.log("error", value)}
        );
    }
/*
  - me va a dar acceso a la lista completa de cartas.
  - me da servicios de selección manual. Puedo agregar y quitar a demanda de una subselección de cartas (sólo se almacenaría una lista de ids)
  - me da servicios de solución final. Dada la lista de cartas y una industria te arma el pitch.
  - wish list:
    - podés tener más (recordar) de una selección o de una solución final.
    - eventualmente se puede implementar una suerte de localstore con selecciones o resultados finales con un nombre que dijita el usuario.

*/

}