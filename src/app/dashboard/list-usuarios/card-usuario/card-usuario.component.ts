import { Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-card-usuario',
  templateUrl: './card-usuario.component.html',
  styleUrl: './card-usuario.component.css'
})
export class CardUsuarioComponent {
  @Input() users:any;
  imgUrl = '/assets/img/perfiles/default.jpg'

  constructor(){}

}
