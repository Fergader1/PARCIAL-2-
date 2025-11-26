import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ToastController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { CharactersService } from 'src/app/core/services/characters.service';
import { FavoritesService } from 'src/app/core/services/favorites.service';
import { Character } from 'src/app/core/interfaces/character';
import { addIcons } from 'ionicons';
import { heart, heartOutline, flash, arrowBack, shareSocialOutline, heartDislikeOutline, statsChart } from 'ionicons/icons'; // Agregamos statsChart
import { Share } from '@capacitor/share';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class DetailPage implements OnInit {
  character: Character | undefined;
  isFav = false;
  
  // Variable para el efecto Parallax
  translateAmt = 0;

  constructor(
    private route: ActivatedRoute,
    private charService: CharactersService,
    private favService: FavoritesService,
    private toastCtrl: ToastController
  ) {
    addIcons({ heart, heartOutline, flash, arrowBack, shareSocialOutline, heartDislikeOutline, statsChart });
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.charService.getCharacterById(id).subscribe(char => {
        this.character = char;
        if (this.character) {
          this.favService.isFavorite$(this.character.id).subscribe(status => {
            this.isFav = status;
          });
        }
      });
    }
  }

  // Método para capturar el scroll
  onScroll(ev: any) {
    // Movemos la imagen de fondo a la mitad de velocidad que el scroll (Parallax)
    this.translateAmt = ev.detail.scrollTop / 2;
  }

  async toggleFav() {
    if (this.character) {
      await this.favService.toggleFavorite(this.character);
      
      const toast = await this.toastCtrl.create({
        message: !this.isFav ? '¡Añadido a tus aliados!' : 'Eliminado de tus aliados',
        duration: 1000,
        position: 'bottom',
        color: !this.isFav ? 'success' : 'medium',
        icon: !this.isFav ? 'heart' : 'heart-dislike-outline'
      });
      toast.present();
    }
  }

  async shareCharacter() {
    if (!this.character) return;
    try {
      await Share.share({
        title: `Personaje: ${this.character.name}`,
        text: `Mira a ${this.character.name}. ¡Poder total: ${this.character.powerStats.total}!`,
        url: 'https://nanatsu-wiki.app/', 
        dialogTitle: 'Compartir Guerrero',
      });
    } catch (error) {
      console.log('Error al compartir', error);
    }
  }

  getBarValue(val: number): number {
    return val / 61000;
  }
}