import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FavoritesService } from '../core/services/favorites.service';
import { Character } from '../core/interfaces/character';
import { addIcons } from 'ionicons';
import { heartDislikeOutline, chevronForward, heart, trash } from 'ionicons/icons'; // Importamos 'trash'
import { Observable } from 'rxjs';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule]
})
export class Tab2Page implements OnInit {
  favorites$: Observable<Character[]>;

  constructor(private favService: FavoritesService) {
    addIcons({ heart, heartDislikeOutline, chevronForward, trash });
    this.favorites$ = this.favService.favorites$;
  }

  ngOnInit() {}

  // Nuevo método para borrar desde el deslizamiento
  async removeFav(char: Character) {
    await this.favService.toggleFavorite(char);
  }
}