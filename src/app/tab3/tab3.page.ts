import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { addIcons } from 'ionicons';
import { moon, trash, logoGithub, openOutline } from 'ionicons/icons';
import { FavoritesService } from '../core/services/favorites.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class Tab3Page {
  darkMode = true;

  constructor(private favService: FavoritesService) {
    addIcons({ moon, trash, logoGithub, openOutline });
  }

  toggleTheme(event: any) {
    if (event.detail.checked) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }

  async clearFavorites() {
    await this.favService.clearAll();
    // Usamos un alert nativo simple o podrías usar ToastController si prefieres
    alert('Has disuelto tu orden de caballeros (Favoritos borrados).');
  }
}